import React, { useState, useEffect, useMemo } from 'react';
import { fetchDocuments, fetchAccounts, fetchArticles } from '../services/googleSheetService.ts';
import type { DocumentData, Account, ScientificArticle, Badge } from '../types.ts';
import { transformGoogleDriveImageUrl } from '../utils/imageUtils.ts';
import { getMonthYearFromVNDate, formatVNDate } from '../utils/dateUtils.ts';
import { Icon } from './shared/Icon.tsx';
import { getUserBadges } from '../utils/badgeUtils.ts';
import { BadgePill } from './shared/BadgePill.tsx';

// This is the placeholder image content.
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600' style='background-color:%23e2e8f0;'%3E%3Cg fill='%2394a3b8' fill-opacity='0.6'%3E%3Crect x='200' y='250' width='400' height='40' rx='5'/%3E%3Crect x='250' y='310' width='300' height='20' rx='3'/%3E%3Crect x='250' y='340' width='300' height='20' rx='3'/%3E%3C/g%3E%3C/svg%3E";

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [articles, setArticles] = useState<ScientificArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const DOCUMENTS_PER_PAGE = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [docData, accData, artData] = await Promise.all([
          fetchDocuments(),
          fetchAccounts(),
          fetchArticles(),
        ]);
        setDocuments(docData);
        setAccounts(accData);
        setArticles(artData);
        setError(null);
      } catch (err) {
        setError('Không thể tải tài liệu. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const badgesByUsername = useMemo(() => {
    if (accounts.length === 0) return new Map<string, Badge[]>();
    
    const articlesByEmail: { [email: string]: ScientificArticle[] } = {};
    articles.forEach(art => {
        const email = art.SubmitterEmail.toLowerCase();
        if (!articlesByEmail[email]) articlesByEmail[email] = [];
        articlesByEmail[email].push(art);
    });

    const badgeMap = new Map<string, Badge[]>();
    accounts.forEach(acc => {
        const userArticles = articlesByEmail[acc.Email.toLowerCase()] || [];
        const badges = getUserBadges(acc, userArticles);
        badgeMap.set(acc['Tên tài khoản'], badges);
    });
    return badgeMap;
  }, [accounts, articles]);


  const categoryColors: { [key: string]: string } = {
    'Giải phẫu': 'bg-blue-100 text-blue-800',
    'Dược lý': 'bg-green-100 text-green-800',
    'Nội khoa': 'bg-indigo-100 text-indigo-800',
    'Ngoại khoa': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  // Memoize filtered and sorted documents
  const filteredAndSortedDocuments = useMemo(() => {
    return documents
      .filter(doc => {
        const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
        const matchesDate = dateFilter === 'All' || getMonthYearFromVNDate(doc.uploadDate) === dateFilter;
        const matchesSearch = searchTerm === '' ||
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesDate && matchesSearch;
      })
      .sort((a, b) => {
        // Helper to parse Vietnamese date format for correct sorting
        const parseVNDate = (dateStr?: string): number => {
            if (!dateStr) return 0;
            const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
            if (!parts) return 0;
            return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5], +parts[6]).getTime();
        };
        return parseVNDate(b.uploadDate) - parseVNDate(a.uploadDate); // Sort descending by date
      });
  }, [documents, searchTerm, categoryFilter, dateFilter]);

  // Memoize filter options
  const uniqueCategories = useMemo(() => ['All', ...Array.from(new Set(documents.map(d => d.category).filter(Boolean)))], [documents]);
  const uniqueDates = useMemo(() => {
      const dates = new Set(documents.map(d => getMonthYearFromVNDate(d.uploadDate)).filter(Boolean));
      // Sort dates logically, newest first
      const sortedDates = Array.from(dates).sort((a, b) => {
        const [, monthA, yearA] = a.match(/(\d+), (\d+)/) || [];
        const [, monthB, yearB] = b.match(/(\d+), (\d+)/) || [];
        const dateA = new Date(+yearA, +monthA - 1);
        const dateB = new Date(+yearB, +monthB - 1);
        return dateB.getTime() - dateA.getTime();
      });
      return ['All', ...sortedDates];
  }, [documents]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / DOCUMENTS_PER_PAGE);
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * DOCUMENTS_PER_PAGE,
    currentPage * DOCUMENTS_PER_PAGE
  );
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, dateFilter]);
  
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
            startPage = 2;
            endPage = 4;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 3;
            endPage = totalPages - 1;
        }
        
        for (let i = startPage; i <= endPage; i++) items.push(i);
        
        if (currentPage < totalPages - 2) items.push('...');
        items.push(totalPages);
    }
    return items;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    // Simple pagination for mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    if (isMobile) {
      return (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
      );
    }

    // Full pagination for desktop
    return (
      <nav className="flex justify-center items-center space-x-2 mt-12" aria-label="Pagination">
        {getPaginationItems().map((item, index) =>
          typeof item === 'number' ? (
            <button
              key={index}
              onClick={() => setCurrentPage(item)}
              className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                currentPage === item
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={index} className="px-2 py-1 text-gray-500">
              ...
            </span>
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

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Thư viện tài liệu</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá kho tài liệu phong phú được chia sẻ từ cộng đồng.
        </p>
      </section>

      {/* Contribution Section */}
      <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4">
            <Icon name="document" className="w-10 h-10 text-white/80 flex-shrink-0 mt-1" />
            <div className="flex-grow">
                <h3 className="text-2xl font-bold">Đóng góp tài liệu cho EdifyX</h3>
                <p className="mt-2 text-blue-100">
                    Để đóng góp cho cộng đồng, vui lòng gửi tài liệu của bạn tới email: <strong className="font-semibold select-all">bduc6974@gmail.com</strong>.
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="font-semibold text-blue-50">Các loại tài liệu được chấp nhận:</p>
                    <ul className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-blue-100 list-disc list-inside">
                        <li>Sách y học</li>
                        <li>Bài tập</li>
                        <li>Bài giảng</li>
                        <li>Video</li>
                        <li>Báo cáo khoa học</li>
                        <li>Tài liệu sưu tầm</li>
                        <li>Tiểu luận</li>
                        <li className="font-bold text-white">Nghiên cứu khoa học (ưu tiên)</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm border">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên sách, tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'Tất cả chuyên ngành' : cat}</option>
          ))}
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {uniqueDates.map(date => (
            <option key={date} value={date}>{date === 'All' ? 'Tất cả thời gian' : date}</option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      {paginatedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paginatedDocuments.map((doc, index) => {
            const uploaderBadges = badgesByUsername.get(doc.uploader) || [];
            return (
              <a
                key={`${doc.documentUrl}-${index}`}
                href={doc.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={imageErrors.has(doc.imageUrl) ? placeholderImage : transformGoogleDriveImageUrl(doc.imageUrl)}
                    alt={`Bìa sách ${doc.title}`}
                    onError={() => handleImageError(doc.imageUrl)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 self-start ${categoryColors[doc.category] || categoryColors.default}`}>
                    {doc.category}
                  </span>
                  <h3 className="font-bold text-gray-800 text-md leading-tight group-hover:text-blue-600 transition-colors flex-grow">
                    {doc.title}
                  </h3>
                   <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
                    <span>{doc.author}</span>
                    <span>{doc.uploadDate ? formatVNDate(doc.uploadDate) : ''}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                    <span>Đăng bởi: {doc.uploader}</span>
                    {uploaderBadges.map(badge => <BadgePill key={badge.name} badge={badge} />)}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 rounded-lg">
          <Icon name="search" className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Không tìm thấy tài liệu</h3>
          <p className="mt-2 text-gray-500">
            Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
          </p>
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default Documents;