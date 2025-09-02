
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { addArticle } from '../services/googleSheetService.ts';
import { Icon } from './shared/Icon.tsx';

type SubmissionType = 'url' | 'text';

const detectSpam = (title: string, abstract: string): string | null => {
    const cleanedTitle = title.trim();
    const cleanedAbstract = abstract.trim();

    if (cleanedTitle.length < 10) {
        return "Tiêu đề quá ngắn. Vui lòng cung cấp một tiêu đề chi tiết hơn.";
    }
    if (cleanedAbstract.length < 50) {
        return "Tóm tắt quá ngắn. Vui lòng cung cấp một bản tóm tắt chi tiết hơn.";
    }
    if (cleanedAbstract.split(' ').length < 10) {
         return "Tóm tắt có vẻ không hợp lệ. Vui lòng viết thành các câu hoàn chỉnh.";
    }

    // Check for gibberish (e.g., long string without spaces)
    if (cleanedTitle.length > 30 && !cleanedTitle.includes(' ')) {
         return "Tiêu đề có vẻ là một chuỗi ký tự ngẫu nhiên. Vui lòng kiểm tra lại.";
    }

    // Check for character randomness (low letter-to-symbol/number ratio)
    const checkRandomness = (text: string, threshold: number): boolean => {
        const letters = (text.match(/[a-zA-Zàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ]/gi) || []).length;
        if (text.length === 0) return false;
        return (letters / text.length) < threshold;
    };

    if (checkRandomness(cleanedTitle, 0.6)) {
         return "Tiêu đề chứa quá nhiều ký tự không phải chữ cái hoặc ký tự đặc biệt. Vui lòng kiểm tra lại.";
    }
    if (checkRandomness(cleanedAbstract, 0.7)) {
         return "Tóm tắt chứa quá nhiều ký tự không phải chữ cái hoặc ký tự đặc biệt. Vui lòng kiểm tra lại.";
    }

    return null; // No spam detected
};


const SubmitArticle: React.FC = () => {
    const [formData, setFormData] = useState({
        Title: '',
        Authors: '',
        Abstract: '',
        Keywords: '',
        Category: 'Nội khoa',
    });
    const [submissionType, setSubmissionType] = useState<SubmissionType>('url');
    const [documentContent, setDocumentContent] = useState('');
    const [academicLevel, setAcademicLevel] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const academicLevels = [
        { key: 'HSGQG', value: 'Học sinh Giỏi Quốc gia' },
        { key: 'HSG Tỉnh', value: 'Học sinh Giỏi Tỉnh' },
        { key: 'THPT', value: 'THPT' },
        { key: 'SV Y', value: 'Sinh viên trường Y' },
        { key: 'NCS', value: 'Nghiên cứu sinh' },
        { key: 'ThS', value: 'Thạc sĩ' },
        { key: 'NNC Tự do', value: 'Nhà nghiên cứu tự do' },
    ];

    const medicalSpecialties = [
        'Nội khoa', 'Ngoại khoa', 'Sản khoa', 'Nhi khoa', 'Tim mạch', 'Hô hấp', 
        'Tiêu hóa', 'Thần kinh', 'Da liễu', 'Chẩn đoán hình ảnh', 'Ung bướu', 
        'Gây mê hồi sức', 'Giải phẫu', 'Dược lý', 'Khác'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!currentUser) {
            setError('Bạn phải đăng nhập để đăng bài.');
            return;
        }

        const spamError = detectSpam(formData.Title, formData.Abstract);
        if (spamError) {
            setError(`Cảnh báo: ${spamError}`);
            return;
        }

        if (submissionType === 'url' && !documentContent) {
            setError('Vui lòng cung cấp URL đến tệp PDF.');
            return;
        }
        if (submissionType === 'text' && !documentContent) {
            setError('Vui lòng nhập nội dung toàn văn của bài báo.');
            return;
        }

        setIsLoading(true);
        try {
            const finalDocumentURL = submissionType === 'url' ? documentContent : `text://${documentContent}`;
            
            let finalAuthors = formData.Authors.trim();
            if (academicLevel) {
                finalAuthors = `${finalAuthors} (${academicLevel})`;
            }

            const submissionData = {
                ...formData,
                Authors: finalAuthors,
                DocumentURL: finalDocumentURL,
            };

            const result = await addArticle(submissionData as any, currentUser.Email);

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
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p className="font-bold">Không thể gửi bài</p><p>{error}</p></div>}
                
                <div>
                    <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài báo</label>
                    <input type="text" name="Title" id="Title" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
                
                <div>
                    <label htmlFor="Authors" className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                    <input type="text" name="Authors" id="Authors" required placeholder="Nguyễn Văn A, Trần Thị B" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.Authors} onChange={handleChange} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi nhận thành tích (tùy chọn)</label>
                    <div className="flex flex-wrap gap-2">
                        {academicLevels.map(level => (
                            <button
                                type="button"
                                key={level.key}
                                onClick={() => setAcademicLevel(current => current === level.value ? null : level.value)}
                                className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors ${
                                    academicLevel === level.value 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {level.key}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Thành tích sẽ được hiển thị bên cạnh tên tác giả. Nhấn lần nữa để bỏ chọn.</p>
                </div>
                
                <div>
                    <label htmlFor="Abstract" className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt (Abstract)</label>
                    <textarea name="Abstract" id="Abstract" rows={6} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}></textarea>
                </div>
                
                <div>
                    <label htmlFor="Keywords" className="block text-sm font-medium text-gray-700 mb-1">Từ khóa</label>
                    <input type="text" name="Keywords" id="Keywords" required placeholder="Tim mạch, Chẩn đoán hình ảnh,..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
                </div>
                
                <div>
                    <label htmlFor="Category" className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                    <select name="Category" id="Category" value={formData.Category} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                        {medicalSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức đăng tải</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 flex-1">
                            <input type="radio" name="submissionType" value="url" checked={submissionType === 'url'} onChange={() => setSubmissionType('url')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="ml-3 text-sm font-medium text-gray-700">Liên kết PDF</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 flex-1">
                            <input type="radio" name="submissionType" value="text" checked={submissionType === 'text'} onChange={() => setSubmissionType('text')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="ml-3 text-sm font-medium text-gray-700">Nhập văn bản</span>
                        </label>
                    </div>
                </div>

                {submissionType === 'url' ? (
                    <div>
                        <label htmlFor="DocumentURL" className="block text-sm font-medium text-gray-700 mb-1">URL Toàn văn (PDF)</label>
                        <input type="url" name="DocumentURL" id="DocumentURL" value={documentContent} required={submissionType === 'url'} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={(e) => setDocumentContent(e.target.value)} />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="FullText" className="block text-sm font-medium text-gray-700 mb-1">Nội dung toàn văn</label>
                        <textarea name="FullText" id="FullText" rows={15} value={documentContent} required={submissionType === 'text'} placeholder="Dán toàn bộ nội dung bài báo của bạn vào đây..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={(e) => setDocumentContent(e.target.value)}></textarea>
                    </div>
                )}


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