
import React, { useState } from 'react';
import type { DocumentData } from '../../types.ts';

interface AddDocumentFormProps {
  onClose: () => void;
  onSave: (data: Omit<DocumentData, 'uploader' | 'uploadDate'>) => Promise<void>;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Giải phẫu',
    pages: 0,
    imageUrl: '',
    documentUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'pages' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onSave(formData);
      // On success, parent component will close the modal.
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm tài liệu mới</h2>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input type="text" name="title" id="title" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input type="text" name="author" id="author" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select name="category" id="category" value={formData.category} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                    <option>Giải phẫu</option>
                    <option>Dược lý</option>
                    <option>Nội khoa</option>
                    <option>Ngoại khoa</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">Số trang</label>
                  <input type="number" name="pages" id="pages" value={formData.pages} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                <input type="url" name="imageUrl" id="imageUrl" placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
              </div>
              
              <div>
                <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-1">URL tài liệu</label>
                <input type="url" name="documentUrl" id="documentUrl" required placeholder="https://example.com/document.pdf" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
              Hủy
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentForm;