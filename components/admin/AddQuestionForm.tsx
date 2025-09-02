
import React, { useState } from 'react';

interface AddQuestionFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    questionType: 'Thi chạy trạm',
    questionText: '',
    imageUrl: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A',
    explanation: '',
    category: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm câu hỏi mới</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">Loại câu hỏi</label>
              <select name="questionType" id="questionType" value={formData.questionType} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}>
                <option>Thi chạy trạm</option>
                <option>Dược học</option>
                <option>Y đa khoa</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">Câu hỏi</label>
              <textarea name="questionText" id="questionText" rows={3} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}></textarea>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh (tùy chọn)</label>
              <input type="url" name="imageUrl" id="imageUrl" placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Các lựa chọn</label>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map(option => (
                  <div key={option} className="flex items-center gap-3">
                    <span className="font-semibold text-gray-500">{option}.</span>
                    <input
                      type="text"
                      name={option}
                      required
                      placeholder={`Lựa chọn ${option}`}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleOptionChange}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option}
                      checked={formData.correctAnswer === option}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      onChange={handleChange}
                    />
                    <label className="text-sm text-gray-600">Đúng</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">Giải thích</label>
              <textarea name="explanation" id="explanation" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange}></textarea>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <input type="text" name="category" id="category" required placeholder="VD: Chẩn đoán, Điều trị, Triệu chứng..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" onChange={handleChange} />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionForm;
