
import React from 'react';
import { Icon } from './Icon.tsx';

export interface QuizOption {
  questions: number;
  time: number; // in minutes
}

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (config: QuizOption) => void;
  title: string;
  options: QuizOption[];
}

const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  isOpen,
  onClose,
  onStart,
  title,
  options,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleStart = (option: QuizOption) => {
    onStart(option);
    // The parent component will handle closing the modal if needed
  };
  
  const modalContent = (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all animate-fade-in-up">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
        >
            <Icon name="close" className="w-6 h-6" />
        </button>
        </div>
        <div className="p-6">
        <p className="text-center text-gray-600 mb-6">Chọn số lượng câu hỏi và thời gian tương ứng để bắt đầu.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((opt) => (
            <button
                key={`${opt.questions}-${opt.time}`}
                onClick={() => handleStart(opt)}
                className="group p-4 border-2 border-gray-200 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
                <p className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">
                {opt.questions} câu
                </p>
                <p className="text-sm text-gray-500 group-hover:text-blue-500">
                {opt.time} phút
                </p>
            </button>
            ))}
        </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-2xl">
        <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            Hủy
        </button>
        </div>
    </div>
  );


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
        {modalContent}
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuizConfigModal;