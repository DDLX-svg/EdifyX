
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchPublications, fetchArticles } from '../services/googleSheetService';
import type { DocumentData, ScientificArticle } from '../types';
import { transformGoogleDriveImageUrl } from '../utils/imageUtils';
import { getMonthYearFromVNDate, formatVNDate } from '../utils/dateUtils';
import { Icon } from './shared/Icon';
import { useAuth } from '../contexts/AuthContext';

// This is the placeholder image content.
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600' style='background-color:%23e2e8f0;'%3E%3Cg fill='%2394a3b8' fill-opacity='0.6'%3E%3Crect x='200' y='250' width='400' height='40' rx='5'/%3E%3Crect x='250' y='310' width='300' height='20' rx='3'/%3E%3Crect x='250' y='340' width='300' height='20' rx='3'/%3E%3C/g%3E%3C/svg%3E";

const Publications: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [articles, setArticles] = useState<ScientificArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [honorFilter, setHonorFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showOnlyMyHonors, setShowOnlyMyHonors] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { currentUser } = useAuth();

  const DOCUMENTS_PER_PAGE = 8;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [pubData, artData] = await Promise.all([
          fetchPublications(),
          fetchArticles(),
        ]);
        setDocuments(pubData);
        setArticles(artData);
        setError(null);
      } catch (err) {
        setError('Không thể tải các ấn phẩm. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const articleInfoMap = useMemo(() => {
    const map = new Map<string, { email: string; authors: string }>();
    articles.forEach(art => {
      // The "Vinh danh" column might contain the full SM_DOI or just the base ID. We map both.
      map.set(art.SM_DOI, { email: art.SubmitterEmail, authors: art.Authors });
      map.set(art.ID, { email: art.SubmitterEmail, authors: art.Authors });
    });
    return map;
  }, [articles]);

  const getHonoreeInfo = useCallback((doc: DocumentData): { email: string | null; authors: string } => {
    const honoreeField = doc.category; // This is the "Vinh danh" column
    if (articleInfoMap.has(honoreeField)) {
      return articleInfoMap.get(honoreeField)!;
    }
    return { email: null, authors: honoreeField };
  }, [articleInfoMap]);

  const filteredAndSortedDocuments = useMemo(() => {
    let filteredDocs: DocumentData[];

    if (showOnlyMyHonors && currentUser) {
      filteredDocs = documents.filter(doc => {
        const honoreeInfo = getHonoreeInfo(doc);
        // Case 1: Honored via SM_DOI/ID, check against user's email
        if (honoreeInfo.email) {
          return honoreeInfo.email.toLowerCase() === currentUser.Email.toLowerCase();
        }
        // Case 2: Honored via plain name, check against user's account name
        return honoreeInfo.authors.toLowerCase() === currentUser['Tên tài khoản'].toLowerCase();
      });
    } else {
      filteredDocs = documents.filter(doc => {
        const honoreeInfo = getHonoreeInfo(doc);
        const matchesHonoree = honorFilter === 'All' || honoreeInfo.authors === honorFilter;
        const matchesDate = dateFilter === 'All' || getMonthYearFromVNDate(doc.uploadDate) === dateFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
          doc.title.toLowerCase().includes(searchLower) ||
          doc.author.toLowerCase().includes(searchLower) ||
          honoreeInfo.authors.toLowerCase().includes(searchLower);
        return matchesHonoree && matchesDate && matchesSearch;
      });
    }

    return filteredDocs.sort((a, b) => {
      const parseVNDate = (dateStr?: string): number => {
        if (!dateStr) return 0;
        const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
        if (!parts) return 0;
        return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5], +parts[6]).getTime();
      };
      return parseVNDate(b.uploadDate) - parseVNDate(a.uploadDate);
    });
  }, [documents, searchTerm, honorFilter, dateFilter, showOnlyMyHonors, currentUser, getHonoreeInfo]);

  const uniqueHonorees = useMemo(() => {
    const honorees = new Set(documents.map(d => getHonoreeInfo(d).authors));
    return ['All', ...Array.from(honorees).filter(Boolean).sort()];
  }, [documents, getHonoreeInfo]);

  const uniqueDates = useMemo(() => {
      const dates = new Set(documents.map(d => getMonthYearFromVNDate(d.uploadDate)).filter(Boolean));
      const sortedDates = Array.from(dates).sort((a, b) => {
        const [, monthA, yearA] = a.match(/(\d+), (\d+)/) || [];
        const [, monthB, yearB] = b.match(/(\d+), (\d+)/) || [];
        const dateA = new Date(+yearA, +monthA - 1);
        const dateB = new Date(+yearB, +monthB - 1);
        return dateB.getTime() - dateA.getTime();
      });
      return ['All', ...sortedDates];
  }, [documents]);

  const totalPages = Math.ceil(filteredAndSortedDocuments.length / DOCUMENTS_PER_PAGE);
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * DOCUMENTS_PER_PAGE,
    currentPage * DOCUMENTS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, honorFilter, dateFilter, showOnlyMyHonors]);
  
  const handleImageError = (imageUrl: string) => {
    if (!imageErrors.has(imageUrl)) {
        setImageErrors(prev => new Set(prev).add(imageUrl));
    }
  };

  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
        items.push(1);
        if (currentPage > 3) items.push('...');
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        if (currentPage <= 3) {
            endPage = 4;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 3;
        }
        for (let i = startPage; i <= endPage; i++) items.push(i);
        if (currentPage < totalPages - 2) items.push('...');
        items.push(totalPages);
    }
    return items;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <nav className="flex justify-center items-center space-x-2 mt-12" aria-label="Pagination">
        {getPaginationItems().map((item, index) =>
          typeof item === 'number' ? (
            <button key={index} onClick={() => setCurrentPage(item)} className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${ currentPage === item ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {item}
            </button>
          ) : (
            <span key={index} className="px-2 py-1 text-gray-500">...</span>
          )
        )}
      </nav>
    );
  };
  
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }
  
  const getEmptyStateMessage = () => {
    if (showOnlyMyHonors) {
        return "Bạn chưa có ấn phẩm nào được vinh danh.";
    }
    if (honorFilter !== 'All' || dateFilter !== 'All' || searchTerm) {
        return "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.";
    }
    return "Hiện chưa có ấn phẩm nào.";
  };

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Icon name="star" className="w-14 h-14 text-white" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Ấn phẩm SuniMed</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl">
                        Nơi vinh danh những đóng góp tri thức xuất sắc nhất từ cộng đồng SuniMed. Mỗi tháng, đội ngũ chuyên gia của chúng tôi tuyển chọn và giới thiệu những công trình nghiên cứu đột phá, tài liệu chuyên sâu và bài tập thực tiễn giá trị nhất.
                    </p>
                </div>
            </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full"><Icon name="check-circle" className="w-6 h-6 text-indigo-600" /></div>
                <div><h3 className="font-bold text-gray-800">Chất lượng tuyển chọn</h3><p className="text-sm text-gray-600 mt-1">Mỗi ấn phẩm đều được đội ngũ chuyên gia thẩm định kỹ lưỡng.</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-sky-500 flex items-start gap-4">
                <div className="bg-sky-100 p-3 rounded-full"><Icon name="calendar" className="w-6 h-6 text-sky-600" /></div>
                <div><h3 className="font-bold text-gray-800">Cập nhật hàng tháng</h3><p className="text-sm text-gray-600 mt-1">Khám phá những nội dung mới và giá trị nhất vào mỗi đầu tháng.</p></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500 flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-full"><Icon name="academic-cap" className="w-6 h-6 text-emerald-600" /></div>
                <div><h3 className="font-bold text-gray-800">Vinh danh tác giả</h3><p className="text-sm text-gray-600 mt-1">Tôn vinh những đóng góp xuất sắc từ cộng đồng các nhà nghiên cứu.</p></div>
            </div>
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-sm border">
        <div className="relative">
          <input type="text" placeholder="Tìm theo tên sách, tác giả..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon name="search" className="w-5 h-5 text-gray-400" /></div>
        </div>
        <select value={honorFilter} onChange={(e) => setHonorFilter(e.target.value)} disabled={showOnlyMyHonors} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100">
          {uniqueHonorees.map(honoree => (<option key={honoree} value={honoree}>{honoree === 'All' ? 'Tất cả người được vinh danh' : honoree}</option>))}
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} disabled={showOnlyMyHonors} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100">
          {uniqueDates.map(date => (<option key={date} value={date}>{date === 'All' ? 'Tất cả thời gian' : date}</option>))}
        </select>
        <button
          onClick={() => setShowOnlyMyHonors(prev => !prev)}
          className={`w-full px-4 py-2 border rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            showOnlyMyHonors
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Icon name={showOnlyMyHonors ? 'check-circle' : 'star'} className="w-5 h-5" />
          <span>Vinh danh tôi</span>
        </button>
      </div>

      {paginatedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {paginatedDocuments.map((doc, index) => {
            const honoreeInfo = getHonoreeInfo(doc);
            return (
                <a key={`${doc.documentUrl}-${index}`} href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="group block bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 md:flex hover:shadow-lg border border-transparent hover:border-blue-300">
                  <div className="md:w-1/3 md:flex-shrink-0">
                    <img
                      src={imageErrors.has(doc.imageUrl) ? placeholderImage : transformGoogleDriveImageUrl(doc.imageUrl)}
                      alt={`Bìa ${doc.title}`}
                      onError={() => handleImageError(doc.imageUrl)}
                      className="h-48 w-full object-cover md:h-full md:w-full"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Tác giả:</span> {doc.author}
                      </p>
                      {honoreeInfo.authors && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md">
                          <Icon name="star" className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <div>
                            <span className="font-semibold">Vinh danh:</span>
                            <span className="ml-1">{honoreeInfo.authors}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <span>{doc.uploadDate ? formatVNDate(doc.uploadDate) : ''}</span>
                    </div>
                  </div>
                </a>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 rounded-lg">
          <Icon name="search" className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Không tìm thấy ấn phẩm</h3>
          <p className="mt-2 text-gray-500">
            {getEmptyStateMessage()}
          </p>
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default Publications;
