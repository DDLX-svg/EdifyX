
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './shared/Icon.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { fetchDocuments, fetchAllQuestions, fetchArticles, updateArticleStatus, updateArticleFeedback } from '../services/googleSheetService.ts';
import type { DocumentData, AnyQuestion, ScientificArticle } from '../types.ts';

type SortDirection = 'ascending' | 'descending';
type DocumentSortKeys = keyof DocumentData;
type QuestionSortKeys = keyof AnyQuestion;
type ArticleSortKeys = keyof ScientificArticle;
type SortConfig<K> = { key: K | null; direction: SortDirection };

// Updated SortableHeader to be a generic component for better type safety
const SortableHeader = <K extends string>({
  name,
  sortConfig,
  onSort,
  children,
}: {
  name: K;
  sortConfig: SortConfig<K>;
  onSort: (key: K) => void;
  children: React.ReactNode;
}) => {
  const isSorted = sortConfig.key === name;
  const directionIcon = sortConfig.direction === 'ascending' ? 'arrowUp' : 'arrowDown';
  return (
    <th scope="col" className="px-6 py-3">
      <button onClick={() => onSort(name)} className="flex items-center gap-1.5 group font-bold">
        {children}
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
            {isSorted ? (
              <Icon name={directionIcon} className="w-4 h-4" />
            ) : (
              <Icon name="arrowDown" className="w-4 h-4 opacity-30" />
            )}
        </span>
      </button>
    </th>
  );
};


const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    return (
        <div className="mt-6 flex justify-end items-center space-x-2 p-4">
             <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
        </div>
    )
}

const FeedbackModal: React.FC<{
  article: ScientificArticle;
  onClose: () => void;
  onSave: (articleId: string, feedback: string) => Promise<void>;
}> = ({ article, onClose, onSave }) => {
    const [feedback, setFeedback] = useState(article.Feedback || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await onSave(article.ID, feedback);
        setIsLoading(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Góp ý cho bài báo</h2>
              <p className="text-sm text-gray-600 mb-4 truncate" title={article.Title}>"{article.Title}"</p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập phản hồi của bạn ở đây..."
              />
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button type="button" onClick={handleSave} disabled={isLoading} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400">
                {isLoading ? 'Đang lưu...' : 'Lưu góp ý'}
              </button>
            </div>
        </div>
      </div>
    );
};


const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'questions' | 'articles'>('documents');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentArticleForFeedback, setCurrentArticleForFeedback] = useState<ScientificArticle | null>(null);
  const { currentUser } = useAuth();

  // Data state
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [questions, setQuestions] = useState<AnyQuestion[]>([]);
  const [articles, setArticles] = useState<ScientificArticle[]>([]);

  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [articlesError, setArticlesError] = useState<string | null>(null);


  // Document table state
  const [docSearch, setDocSearch] = useState('');
  const [docCategory, setDocCategory] = useState('All');
  const [docPage, setDocPage] = useState(1);
  const [docSort, setDocSort] = useState<SortConfig<DocumentSortKeys>>({ key: 'uploadDate', direction: 'descending' });
  const DOCS_PER_PAGE = 10;
  
  // Question table state
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionType, setQuestionType] = useState('All');
  const [questionPage, setQuestionPage] = useState(1);
  const [questionSort, setQuestionSort] = useState<SortConfig<QuestionSortKeys>>({ key: 'type', direction: 'ascending' });
  const QUESTIONS_PER_PAGE = 10;
  
  // Article table state
  const [articleSearch, setArticleSearch] = useState('');
  const [articleStatus, setArticleStatus] = useState('All');
  const [articlePage, setArticlePage] = useState(1);
  const [articleSort, setArticleSort] = useState<SortConfig<ArticleSortKeys>>({ key: 'SubmissionDate', direction: 'descending' });
  const ARTICLES_PER_PAGE = 10;


  useEffect(() => {
    const loadData = async () => {
      setDocumentsLoading(true);
      try {
        const docData = await fetchDocuments();
        setDocuments(docData); 
      } catch (err) {
        setDocumentsError('Không thể tải danh sách tài liệu.');
        console.error(err);
      } finally {
        setDocumentsLoading(false);
      }

      setQuestionsLoading(true);
      try {
        const questionData = await fetchAllQuestions();
        setQuestions(questionData);
      } catch (err) {
        setQuestionsError('Không thể tải danh sách câu hỏi.');
        console.error(err);
      } finally {
        setQuestionsLoading(false);
      }

      setArticlesLoading(true);
      try {
        const articleData = await fetchArticles();
        setArticles(articleData);
      } catch (err) {
        setArticlesError('Không thể tải danh sách bài báo.');
        console.error(err);
      } finally {
        setArticlesLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    const originalArticles = articles;
    setArticles(prev => prev.map(art => art.ID === articleId ? { ...art, Status: newStatus } : art));

    const result = await updateArticleStatus(articleId, newStatus);
    if (!result.success) {
      setArticles(originalArticles);
      alert(`Lỗi khi cập nhật trạng thái: ${result.error}`);
    }
  };

  const handleSaveFeedback = async (articleId: string, feedback: string) => {
    const originalArticles = articles;
    // Optimistic update
    setArticles(prev => prev.map(art => art.ID === articleId ? { ...art, Feedback: feedback } : art));
    setIsFeedbackModalOpen(false);
    setCurrentArticleForFeedback(null);

    const result = await updateArticleFeedback(articleId, feedback);
    if (!result.success) {
      setArticles(originalArticles);
      alert(`Lỗi khi cập nhật phản hồi: ${result.error}`);
    }
  };


  const parseVNDate = (dateStr?: string): number => {
    if (!dateStr) return 0;
    const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) return 0;
    return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5], +parts[6]).getTime();
  };

  // Memoized data processing for documents
  const processedDocuments = useMemo(() => {
    let filtered = documents
      .filter(doc => docCategory === 'All' || doc.category === docCategory)
      .filter(doc => 
        doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
        doc.author.toLowerCase().includes(docSearch.toLowerCase()) ||
        doc.uploader.toLowerCase().includes(docSearch.toLowerCase())
      );

    if (docSort.key) {
      filtered.sort((a, b) => {
        const { key, direction } = docSort;
        const asc = direction === 'ascending' ? 1 : -1;
        
        const aVal = a[key!];
        const bVal = b[key!];

        if (key === 'uploadDate') {
            return (parseVNDate(aVal as string | undefined) - parseVNDate(bVal as string | undefined)) * asc;
        }

        if (aVal === undefined || aVal === null) return 1 * asc;
        if (bVal === undefined || bVal === null) return -1 * asc;
        
        const valA = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
        const valB = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;

        if (valA < valB) return -1 * asc;
        if (valA > valB) return 1 * asc;
        return 0;
      });
    }
    return filtered;
  }, [documents, docSearch, docCategory, docSort]);


  // Memoized data processing for questions
  const processedQuestions = useMemo(() => {
    let filtered = questions
        .filter(q => questionType === 'All' || q.type === questionType)
        .filter(q => q.Question_Text.toLowerCase().includes(questionSearch.toLowerCase()));

    if (questionSort.key) {
        filtered.sort((a, b) => {
            const { key, direction } = questionSort;
            const asc = direction === 'ascending' ? 1 : -1;

            const aVal = a[key!];
            const bVal = b[key!];
            
            if (aVal === undefined || aVal === null) return 1 * asc;
            if (bVal === undefined || bVal === null) return -1 * asc;

            const valA = typeof aVal === 'string' ? String(aVal).toLowerCase() : aVal;
            const valB = typeof bVal === 'string' ? String(bVal).toLowerCase() : bVal;

            if (valA < valB) return -1 * asc;
            if (valA > valB) return 1 * asc;
            return 0;
        });
    }
    return filtered;
  }, [questions, questionSearch, questionType, questionSort]);

  // Memoized data processing for articles
    const processedArticles = useMemo(() => {
        let filtered = articles
            .filter(art => articleStatus === 'All' || art.Status === articleStatus)
            .filter(art =>
                art.Title.toLowerCase().includes(articleSearch.toLowerCase()) ||
                art.Authors.toLowerCase().includes(articleSearch.toLowerCase()) ||
                art.SubmitterEmail.toLowerCase().includes(articleSearch.toLowerCase())
            );

        if (articleSort.key) {
            filtered.sort((a, b) => {
                const { key, direction } = articleSort;
                const asc = direction === 'ascending' ? 1 : -1;

                if (key === 'SubmissionDate') {
                    return (parseVNDate(a[key]) - parseVNDate(b[key])) * asc;
                }

                const aVal = a[key!];
                const bVal = b[key!];

                if (aVal === undefined || aVal === null) return 1 * asc;
                if (bVal === undefined || bVal === null) return -1 * asc;

                const valA = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
                const valB = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;

                if (valA < valB) return -1 * asc;
                if (valA > valB) return 1 * asc;
                return 0;
            });
        }
        return filtered;
    }, [articles, articleSearch, articleStatus, articleSort]);
  
  const handleDocSort = (key: DocumentSortKeys) => {
    setDocSort(prev => ({ key, direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' }));
  };

  const handleQuestionSort = (key: QuestionSortKeys) => {
    setQuestionSort(prev => ({ key, direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' }));
  };
  
  const handleArticleSort = (key: ArticleSortKeys) => {
    setArticleSort(prev => ({ key, direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' }));
  };


  const renderDocumentsTab = () => {
    const totalPages = Math.ceil(processedDocuments.length / DOCS_PER_PAGE);
    const paginatedDocs = processedDocuments.slice((docPage - 1) * DOCS_PER_PAGE, docPage * DOCS_PER_PAGE);
    const uniqueCategories = ['All', ...Array.from(new Set(documents.map(d => d.category)))];

    return (
      <div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 self-start sm:self-center">Danh sách tài liệu</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm..."
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={docSearch}
                    onChange={e => { setDocSearch(e.target.value); setDocPage(1); }}
                />
                 <select 
                    className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={docCategory}
                    onChange={e => { setDocCategory(e.target.value); setDocPage(1); }}
                >
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'Tất cả danh mục' : cat}</option>)}
                </select>
            </div>
        </div>
        {documentsLoading ? <p className="text-gray-500">Đang tải tài liệu...</p>
         : documentsError ? <p className="text-red-500">{documentsError}</p>
         : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <SortableHeader name="title" sortConfig={docSort} onSort={handleDocSort}>Tiêu đề</SortableHeader>
                  <SortableHeader name="author" sortConfig={docSort} onSort={handleDocSort}>Tác giả</SortableHeader>
                  <SortableHeader name="category" sortConfig={docSort} onSort={handleDocSort}>Danh mục</SortableHeader>
                  <SortableHeader name="uploadDate" sortConfig={docSort} onSort={handleDocSort}>Ngày đăng</SortableHeader>
                  <SortableHeader name="uploader" sortConfig={docSort} onSort={handleDocSort}>Người đăng</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {paginatedDocs.length > 0 ? paginatedDocs.map((doc, index) => (
                  <tr key={`${doc.title}-${index}`} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                    <td className="px-6 py-4">{doc.author}</td>
                    <td className="px-6 py-4">{doc.category}</td>
                    <td className="px-6 py-4">{doc.uploadDate}</td>
                    <td className="px-6 py-4">{doc.uploader}</td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">
                           {documents.length > 0 ? 'Không tìm thấy tài liệu phù hợp.' : 'Chưa có tài liệu nào.'}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={docPage} totalPages={totalPages} onPageChange={setDocPage} />
          </div>
        )}
      </div>
    );
  };
  
  const renderQuestionsTab = () => {
    const totalPages = Math.ceil(processedQuestions.length / QUESTIONS_PER_PAGE);
    const paginatedQuestions = processedQuestions.slice((questionPage - 1) * QUESTIONS_PER_PAGE, questionPage * QUESTIONS_PER_PAGE);
    const questionTypes = ['All', 'Anatomy', 'Medicine', 'Pharmacy'];

    return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 self-start sm:self-center">Danh sách câu hỏi</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
             <input 
                type="text" 
                placeholder="Tìm câu hỏi..."
                className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={questionSearch}
                onChange={e => { setQuestionSearch(e.target.value); setQuestionPage(1); }}
            />
             <select 
                className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={questionType}
                onChange={e => { setQuestionType(e.target.value); setQuestionPage(1); }}
            >
                {questionTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'Tất cả các loại' : type}</option>)}
            </select>
        </div>
      </div>
      {questionsLoading ? <p className="text-gray-500">Đang tải câu hỏi...</p>
       : questionsError ? <p className="text-red-500">{questionsError}</p>
       : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <SortableHeader name="Question_Text" sortConfig={questionSort} onSort={handleQuestionSort}>Câu hỏi</SortableHeader>
                <SortableHeader name="type" sortConfig={questionSort} onSort={handleQuestionSort}>Loại</SortableHeader>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.length > 0 ? paginatedQuestions.map((q, index) => (
                <tr key={`${q.ID}-${index}`} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-4xl truncate" title={q.Question_Text}>{q.Question_Text}</td>
                  <td className="px-6 py-4">{q.type}</td>
                </tr>
              )) : (
                  <tr>
                      <td colSpan={2} className="text-center py-10 text-gray-500">
                         {questions.length > 0 ? 'Không tìm thấy câu hỏi phù hợp.' : 'Chưa có câu hỏi nào.'}
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={questionPage} totalPages={totalPages} onPageChange={setQuestionPage} />
        </div>
      )}
    </div>
  )};

   const renderArticlesTab = () => {
        const totalPages = Math.ceil(processedArticles.length / ARTICLES_PER_PAGE);
        const paginatedArticles = processedArticles.slice((articlePage - 1) * ARTICLES_PER_PAGE, articlePage * ARTICLES_PER_PAGE);
        const articleStatuses = ['All', 'Pending', 'Approved', 'Rejected'];

        return (
            <div>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 self-start sm:self-center">Danh sách bài báo</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={articleSearch}
                            onChange={e => { setArticleSearch(e.target.value); setArticlePage(1); }}
                        />
                        <select
                            className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={articleStatus}
                            onChange={e => { setArticleStatus(e.target.value); setArticlePage(1); }}
                        >
                            {articleStatuses.map(status => <option key={status} value={status}>{status === 'All' ? 'Tất cả trạng thái' : status}</option>)}
                        </select>
                    </div>
                </div>
                {articlesLoading ? <p className="text-gray-500">Đang tải bài báo...</p>
                 : articlesError ? <p className="text-red-500">{articlesError}</p>
                 : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <SortableHeader name="Title" sortConfig={articleSort} onSort={handleArticleSort}>Tiêu đề</SortableHeader>
                                    <SortableHeader name="SubmitterEmail" sortConfig={articleSort} onSort={handleArticleSort}>Người đăng</SortableHeader>
                                    <SortableHeader name="SubmissionDate" sortConfig={articleSort} onSort={handleArticleSort}>Ngày đăng</SortableHeader>
                                    <SortableHeader name="Status" sortConfig={articleSort} onSort={handleArticleSort}>Trạng thái</SortableHeader>
                                    <th scope="col" className="px-6 py-3">Phản hồi</th>
                                    <th scope="col" className="px-6 py-3">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedArticles.length > 0 ? paginatedArticles.map(article => (
                                    <tr key={article.ID} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 max-w-sm truncate">
                                            <Link 
                                                to={`/article/${article.ID}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600 hover:underline"
                                                title={article.Title}
                                            >
                                                {article.Title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">{article.SubmitterEmail}</td>
                                        <td className="px-6 py-4">{article.SubmissionDate}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={article.Status}
                                                onChange={(e) => handleStatusChange(article.ID, e.target.value)}
                                                className={`w-full p-1.5 rounded-md border text-xs font-medium focus:ring-2 focus:ring-blue-400 ${
                                                    article.Status === 'Approved' ? 'bg-green-100 border-green-300 text-green-800' :
                                                    article.Status === 'Pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                                                    article.Status === 'Rejected' ? 'bg-red-100 border-red-300 text-red-800' :
                                                    'bg-gray-100 border-gray-300 text-gray-800'
                                                }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-xs">
                                                <span className="truncate text-gray-500" title={article.Feedback}>{article.Feedback}</span>
                                                <button onClick={() => { setCurrentArticleForFeedback(article); setIsFeedbackModalOpen(true); }} className="text-blue-600 hover:underline flex-shrink-0 font-medium">Sửa</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                           <a href={article.DocumentURL.startsWith('text://') ? `/article/${article.ID}` : article.DocumentURL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium" title="Xem nội dung">
                                              <Icon name="eye" className="w-5 h-5" /> Xem
                                           </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-500">
                                            {articles.length > 0 ? 'Không tìm thấy bài báo phù hợp.' : 'Chưa có bài báo nào.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination currentPage={articlePage} totalPages={totalPages} onPageChange={setArticlePage} />
                    </div>
                )}
            </div>
        );
    };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2 text-sm">
        <Icon name="arrowLeft" className="w-4 h-4" /> Quay lại trang chủ
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-bold">Quản trị nội dung</h1>
            <p className="text-gray-600 mt-2">Quản lý tài liệu và câu hỏi trên hệ thống</p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-md">
            <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center">
                <Icon name="settings" className="w-6 h-6 text-blue-600" />
            </div>
        </div>
      </div>

      <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-lg">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'documents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon name="documentManagement" className="w-5 h-5" />
            Tài liệu ({processedDocuments.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'articles' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon name="beaker" className="w-5 h-5" />
            Nghiên cứu ({processedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'questions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon name="question" className="w-5 h-5" />
            Câu hỏi ({processedQuestions.length})
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'articles' && renderArticlesTab()}
          {activeTab === 'questions' && renderQuestionsTab()}
        </div>
      </div>
      
      {isFeedbackModalOpen && currentArticleForFeedback && (
        <FeedbackModal
            article={currentArticleForFeedback}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSave={handleSaveFeedback}
        />
      )}
    </div>
  );
};

export default Admin;
