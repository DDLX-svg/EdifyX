import { parseCSV } from '../utils/csvParser.ts';
import type { AnatomyQuestion, MedicalQuestion, Account, DocumentData, AnyQuestion, ScientificArticle } from '../types.ts';

const SHEET_ID = '1GMdIGBbcTgj2cLA5Ux-_X3KLGhAwYcgc08r2TjzKFVs';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

// This is the correct, user-provided Google Apps Script URL.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcry1cSDN55wRhVCBT3jLyzg2c66tEYBgi1YZVzx70VIMF8b7VzXcXbfBW5mywHJWRoA/exec';
const fetchData = async <T,>(sheetName: string): Promise<T[]> => {
  const url = `${BASE_URL}${encodeURIComponent(sheetName)}&t=${new Date().getTime()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${sheetName}. Status: ${response.status}`);
  }

  const csvText = await response.text();
  if (!csvText) {
    console.warn(`CSV data for sheet "${sheetName}" is empty.`);
    return [];
  }
  return parseCSV<T>(csvText);
};

const postToAppsScript = async (payload: object): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse server response as JSON:", text);
            throw new Error("Received an invalid response from the server.");
        }

    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng kiểm tra kết nối mạng của bạn.');
        }
        console.error('postToAppsScript Error:', error);
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
};

export const fetchAnatomyQuestions = async (): Promise<AnatomyQuestion[]> => {
  return fetchData<AnatomyQuestion>('Questions_Anatomy');
};

export const fetchPharmacyQuestions = async (): Promise<MedicalQuestion[]> => {
  return fetchData<MedicalQuestion>('Questions_Pharmacy');
};

export const fetchMedicineQuestions = async (): Promise<MedicalQuestion[]> => {
  return fetchData<MedicalQuestion>('Questions_Medicine');
};

export const fetchAllQuestions = async (): Promise<AnyQuestion[]> => {
  try {
    const [anatomy, medicine, pharmacy] = await Promise.all([
      fetchData<AnatomyQuestion>('Questions_Anatomy'),
      fetchData<MedicalQuestion>('Questions_Medicine'),
      fetchData<MedicalQuestion>('Questions_Pharmacy'),
    ]);

    const anatomyQuestions: AnyQuestion[] = anatomy.map(q => ({ ...q, type: 'Anatomy' }));
    const medicineQuestions: AnyQuestion[] = medicine.map(q => ({ ...q, type: 'Medicine' }));
    const pharmacyQuestions: AnyQuestion[] = pharmacy.map(q => ({ ...q, type: 'Pharmacy' }));
    
    return [...anatomyQuestions, ...medicineQuestions, ...pharmacyQuestions];
  } catch (error) {
    console.error("Failed to fetch all questions:", error);
    throw new Error("Could not load all question types.");
  }
};

export const fetchAccounts = async (): Promise<Account[]> => {
  const rawAccounts = await fetchData<any>('Accounts'); 
  return rawAccounts.map((acc: any) => ({
    ...acc,
    'Tuổi': parseInt(acc['Tuổi'] || '0', 10) || 0,
    'Tổng số câu hỏi đã làm': parseInt(acc['Tổng số câu hỏi đã làm'] || '0', 10) || 0,
    'Tổng số câu hỏi đã làm đúng': parseInt(acc['Tổng số câu hỏi đã làm đúng'] || '0', 10) || 0,
    'Tổng số câu hỏi đã làm trong tuần': parseInt(acc['Tổng số câu hỏi đã làm trong tuần'] || '0', 10) || 0,
    'Tổng số câu hỏi đã làm đúng trong tuần': parseInt(acc['Tổng số câu hỏi đã làm đúng trong tuần'] || '0', 10) || 0,
  }));
};

export const fetchDocuments = async (): Promise<DocumentData[]> => {
  const docs = await fetchData<any>('Documents');
  return docs.map((doc: any) => ({
    title: doc['Tiêu đề'] || '',
    author: doc['Tác giả'] || '',
    category: doc['Danh mục'] || '',
    pages: Number(doc['# Số trang']) || 0,
    imageUrl: doc['URL Hình ảnh'] || '',
    documentUrl: doc['URL Tài liệu'] || '',
    uploader: doc['Người đăng'] || '',
    uploadDate: doc['Ngày đăng'] || '',
  }));
};

export const fetchPublications = async (): Promise<DocumentData[]> => {
  const docs = await fetchData<any>('Publications');
  return docs.map((doc: any) => ({
    title: doc['Tiêu đề'] || '',
    author: doc['Tác giả'] || '',
    category: doc['Vinh danh'] || '',
    pages: Number(doc['# Số trang']) || 0,
    imageUrl: doc['URL Hình ảnh'] || '',
    documentUrl: doc['URL Tài liệu'] || '',
    uploader: doc['Người đăng'] || '',
    uploadDate: doc['Ngày đăng'] || '',
  }));
};

export const fetchArticles = async (): Promise<ScientificArticle[]> => {
    // IMPORTANT: This function requires the "Research_Accounts" Google Sheet to have the exact English column headers.
    // Any discrepancy will cause data to not display correctly.
    // Required headers: ID, Title, Authors, Abstract, Keywords, Category, DocumentURL, SubmitterEmail, SubmissionDate, Pending, Feedback
    const rawArticles = await fetchData<any>('Research_Accounts');
    return rawArticles.map((art: any) => {
      const id = art['ID'] || '';
      return {
          ID: id,
          SM_DOI: `080727${id}`,
          Title: art['Title'] || '',
          Authors: art['Authors'] || '',
          Abstract: art['Abstract'] || '',
          Keywords: art['Keywords'] || '',
          Category: art['Category'] || '',
          DocumentURL: art['DocumentURL'] || '',
          SubmitterEmail: art['SubmitterEmail'] || '',
          SubmissionDate: art['SubmissionDate'] || '',
          // The status column header is named 'Pending' in the user's sheet.
          Status: art['Pending'] || 'Pending', 
          Feedback: art['Feedback'] || '',
      };
    });
};


export const registerUser = async (userData: Pick<Account, 'Tên tài khoản' | 'Email' | 'Mật khẩu' | 'Tuổi' | 'Vai trò'>): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToAppsScript({
            action: 'registerUser',
            username: userData['Tên tài khoản'],
            email: userData.Email,
            password: userData['Mật khẩu'],
            age: userData['Tuổi'],
            role: userData['Vai trò']
        });
        if (result.status === 'success') {
            return { success: true };
        }
        return { success: false, error: result.message || 'Lỗi không xác định từ máy chủ.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const addArticle = async (articleData: Omit<ScientificArticle, 'ID' | 'SM_DOI' | 'SubmissionDate' | 'SubmitterEmail' | 'Status' | 'Feedback'>, submitterEmail: string): Promise<{ success: boolean; error?: string; newId?: string }> => {
    try {
        const payload = {
            action: 'addArticle',
            Title: articleData.Title,
            Authors: articleData.Authors,
            Abstract: articleData.Abstract,
            Keywords: articleData.Keywords,
            Category: articleData.Category,
            DocumentURL: articleData.DocumentURL || '',
            submitterEmail: submitterEmail
        };
        const result = await postToAppsScript(payload);
        if (result.status === 'success') {
            return { success: true, newId: result.newId };
        }
        return { success: false, error: result.message || 'An unknown error occurred while adding the article.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateArticleStatus = async (articleId: string, status: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToAppsScript({
            action: 'updateArticleStatus',
            id: articleId,
            status: status
        });
        if (result.status === 'success') {
            return { success: true };
        }
        return { success: false, error: result.message || 'An unknown error occurred while updating article status.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateArticleFeedback = async (articleId: string, feedback: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToAppsScript({
            action: 'updateArticleFeedback',
            id: articleId,
            feedback: feedback
        });
        if (result.status === 'success') {
            return { success: true };
        }
        return { success: false, error: result.message || 'An unknown error occurred while updating feedback.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};


export const resendVerificationEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToAppsScript({
            action: 'resendVerificationEmail',
            email: email,
        });
        if (result.status === 'success') {
            return { success: true };
        }
        return { success: false, error: result.message || 'An unknown error occurred.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

/**
 * Gửi kết quả của bài thi gần nhất lên backend.
 * Backend sẽ chịu trách nhiệm cộng điểm vào tổng và tuần.
 */
export const updateUserQuizStats = async (
    email: string, 
    questionsAttempted: number, 
    questionsCorrect: number
): Promise<{ success: boolean; error?: string }> => {
    try {
        const result = await postToAppsScript({
            action: 'updateQuizStats',
            email: email,
            questionsAttempted: questionsAttempted,
            questionsCorrect: questionsCorrect,
        });
        if (result.status === 'success') {
            return { success: true };
        }
        return { success: false, error: result.message || 'Lỗi không xác định khi cập nhật điểm.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};