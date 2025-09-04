export interface AnatomyQuestion {
  ID: string;
  Image_URL: string;
  Question_Text: string;
  Correct_Answer_Label: string;
  Correct_Coordinates: string; // "x,y,radius"
  Time_Limit_Seconds: string;
  Category: string;
}

export interface MedicalQuestion {
  ID: string;
  Specialty?: string; // For Medicine
  Question_Type?: string; // For Pharmacy
  Question_Text: string;
  Option_A: string;
  Option_B: string;
  Option_C: string;
  Option_D: string;
  Correct_Answer: 'A' | 'B' | 'C' | 'D';
  Explanation?: string;
}

export type AnyQuestion = (AnatomyQuestion | MedicalQuestion) & { type: 'Anatomy' | 'Medicine' | 'Pharmacy' };

export interface Account {
  'Tên tài khoản': string;
  'Email': string;
  'Mật khẩu': string;
  'Gói đăng ký': string;
  'Danh hiệu': 'Admin' | 'Developer' | 'User' | string;
  'Đã xác minh': 'Có' | 'Không' | string;
  'Tuổi'?: number;
  'Vai trò'?: 'Sinh viên' | 'Nhà nghiên cứu tự do' | 'Học sinh' | 'Nhà báo (nhà tuyển dụng)';
  // Columns G-J as numbers
  'Tổng số câu hỏi đã làm': number;
  'Tổng số câu hỏi đã làm đúng': number;
  'Tổng số câu hỏi đã làm trong tuần': number;
  'Tổng số câu hỏi đã làm đúng trong tuần': number;
  'Đặc biệt'?: string;
  'Tokens': number;
}


export interface DocumentData {
  title: string;
  author: string;
  category: string;
  pages: number;
  imageUrl: string;
  documentUrl: string;
  uploader: string;
  uploadDate?: string; // Optional because it's not present on client-side creation
}

export interface ScientificArticle {
  ID: string;
  SM_DOI: string;
  Title: string;
  Authors: string;
  Abstract: string;
  Keywords: string; // Comma-separated
  Category: string;
  DocumentURL: string;
  SubmitterEmail: string;
  SubmissionDate: string;
  Status: 'Pending' | 'Approved' | 'Rejected' | string;
  Feedback?: string;
}

export interface Badge {
    name: string;
    description: string;
    icon: string;
    color: string; // Tailwind bg color class
}