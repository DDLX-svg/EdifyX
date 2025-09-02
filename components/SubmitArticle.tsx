import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addArticle } from '../services/googleSheetService';
import { Icon } from './shared/Icon';

const SubmitArticle: React.FC = () => {
    const [formData, setFormData] = useState({
        Title: '',
        Authors: '',
        Abstract: '',
        Keywords: '',
        Category: 'Nội khoa',
        DocumentURL: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setError('Bạn phải đăng nhập để đăng bài.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const result = await addArticle(formData, currentUser.Email);
            if (result.success) {
                navigate('/articles', { state: { message: 'Bài báo của bạn đã được gửi thành công và đang chờ duyệt.' } });
            } else {
                setError(result.error || 'Đã có lỗi xảy ra khi đăng bài.');
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi không xác định.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Đăng bài báo khoa học</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}
                
                <div>
                    <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài báo</label>
                    <input type="text" name="Title" id="Title" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
                
                <div>
                    <label htmlFor="Authors" className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                    <input type="text" name="Authors" id="Authors" required placeholder="Nguyễn Văn A, Trần Thị B" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
                
                <div>
                    <label htmlFor="Abstract" className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt (Abstract)</label>
                    <textarea name="Abstract" id="Abstract" rows={6} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}></textarea>
                </div>
                
                <div>
                    <label htmlFor="Keywords" className="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
                    <input type="text" name="Keywords" id="Keywords" required placeholder="Tim mạch, Chẩn đoán hình ảnh,..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="Category" className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                        <select name="Category" id="Category" value={formData.Category} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                            <option>Nội khoa</option>
                            <option>Ngoại khoa</option>
                            <option>Sản khoa</option>
                            <option>Nhi khoa</option>
                            <option>Giải phẫu</option>
                            <option>Dược lý</option>
                            <option>Khác</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="DocumentURL" className="block text-sm font-medium text-gray-700 mb-1">URL Toàn văn (PDF)</label>
                        <input type="url" name="DocumentURL" id="DocumentURL" required placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => navigate('/articles')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Hủy</button>
                    <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Đang đăng...' : 'Đăng bài'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitArticle;