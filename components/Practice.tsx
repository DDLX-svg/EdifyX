
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './shared/Icon.tsx';
import QuizConfigModal, { QuizOption } from './shared/QuizConfigModal.tsx';
import PracticeAnalytics from './shared/PracticeAnalytics.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

type QuizType = 'anatomy' | 'pharmacy' | 'medicine';

const practiceModes = {
  anatomy: {
    icon: 'x-ray',
    title: 'Thi chạy trạm',
    description: 'Mô phỏng kỳ thi chạy trạm giải phẫu với các bài tập định vị.',
    stats: [{ value: '50+', label: 'Sơ đồ' }, { value: 'Thực tế', label: 'Mô phỏng' }],
    color: 'blue',
    options: [
      { questions: 10, time: 2 }, { questions: 20, time: 3 },
      { questions: 30, time: 4 }, { questions: 50, time: 7 },
    ],
  },
  pharmacy: {
    icon: 'pill',
    title: 'Dược học',
    description: 'Luyện tập kiến thức về các loại thuốc, liều dùng và tương tác.',
    stats: [{ value: '150+', label: 'Câu hỏi' }, { value: 'Linh hoạt', label: 'Thời gian' }],
    color: 'green',
    options: [
      { questions: 10, time: 5 }, { questions: 20, time: 10 },
      { questions: 30, time: 15 }, { questions: 50, time: 25 },
    ],
  },
  medicine: {
    icon: 'logo',
    title: 'Y đa khoa',
    description: 'Câu hỏi trắc nghiệm chuyên sâu từ các khoa lâm sàng.',
    stats: [{ value: '300+', label: 'Câu hỏi' }, { value: 'Thử thách', label: 'Độ khó' }],
    color: 'purple',
     options: [
      { questions: 10, time: 5 }, { questions: 20, time: 10 },
      { questions: 30, time: 15 }, { questions: 50, time: 25 },
    ],
  },
};

const PracticeCard = ({ mode, onStart }: {
  mode: typeof practiceModes[keyof typeof practiceModes],
  onStart: () => void
}) => {
  const colorSchemes = {
    blue: { header: 'from-blue-500 to-cyan-500', button: 'bg-blue-600 hover:bg-blue-700' },
    green: { header: 'from-green-500 to-emerald-500', button: 'bg-green-600 hover:bg-green-700' },
    purple: { header: 'from-purple-500 to-indigo-500', button: 'bg-purple-600 hover:bg-purple-700' },
  };
  const scheme = colorSchemes[mode.color as keyof typeof colorSchemes];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className={`p-8 text-white bg-gradient-to-br ${scheme.header}`}>
        <Icon name={mode.icon} className="w-16 h-16 mb-4 opacity-90" />
        <h3 className="text-3xl font-bold">{mode.title}</h3>
        <p className="mt-2 text-white/90">{mode.description}</p>
      </div>
      <div className="p-8 border-b border-gray-200 flex-grow">
        <div className="grid grid-cols-2 gap-4 text-center">
          {mode.stats.map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-gray-50">
        <button onClick={onStart} className={`w-full ${scheme.button} text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg`}>
          Bắt đầu <Icon name="arrowRight" className="inline-block w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

const TokenAlertModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-8">
            <Icon name="alert" className="w-16 h-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Không đủ token</h2>
            <p className="text-gray-600 mt-2">
                Bạn không có đủ 100 tokens để bắt đầu phiên luyện tập này.
            </p>
            <button
                onClick={onClose}
                className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition"
            >
                Tôi đã hiểu
            </button>
        </div>
    </div>
);

const Practice: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const openModal = (quizType: QuizType) => {
    if (!currentUser || (currentUser['Tokens'] || 0) < 100) {
        setShowTokenModal(true);
    } else {
        setSelectedQuiz(quizType);
        setModalOpen(true);
    }
  };

  const handleStartQuiz = (config: QuizOption) => {
    if (!selectedQuiz) return;
    
    setModalOpen(false); // Explicitly close modal before navigating
    
    let path = '';
    if (selectedQuiz === 'anatomy') {
      path = '/practice/anatomy-station';
    } else {
      path = `/medical-quiz/${selectedQuiz}`;
    }
    navigate(path, { state: config });
  };

  const currentQuizData = selectedQuiz ? practiceModes[selectedQuiz] : null;

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Trung tâm Luyện tập</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Mỗi phiên luyện tập tốn <span className="font-bold text-blue-600">100 tokens</span>. Chọn một hình thức để bắt đầu.
        </p>
      </section>

      {currentUser && <PracticeAnalytics user={currentUser} />}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <PracticeCard mode={practiceModes.anatomy} onStart={() => openModal('anatomy')} />
        <PracticeCard mode={practiceModes.pharmacy} onStart={() => openModal('pharmacy')} />
        <PracticeCard mode={practiceModes.medicine} onStart={() => openModal('medicine')} />
        <a href="https://sites.google.com/view/edufitvn" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
            <div className="p-8 text-white bg-gradient-to-br from-amber-400 to-orange-500">
                <Icon name="academic-cap-solid" className="w-16 h-16 mb-4 opacity-90" />
                <h3 className="text-3xl font-bold">Ôn thi THPT QG</h3>
                <p className="mt-2 text-white/90">Tài liệu và đề thi thử cho kỳ thi Tốt nghiệp THPT Quốc gia.</p>
            </div>
            <div className="p-8 border-b border-gray-200 flex-grow">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-800">Đa dạng</p>
                        <p className="text-sm text-gray-500">Môn học</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">Cập nhật</p>
                        <p className="text-sm text-gray-500">Đề thi</p>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-gray-50">
                <div className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
                    Chuyển đến trang <Icon name="arrowRight" className="inline-block w-5 h-5 ml-2" />
                </div>
            </div>
        </a>
      </div>
      
      {modalOpen && currentQuizData && (
        <QuizConfigModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onStart={handleStartQuiz}
            title={`Cấu hình: ${currentQuizData.title}`}
            options={currentQuizData.options}
        />
      )}

      {showTokenModal && <TokenAlertModal onClose={() => setShowTokenModal(false)} />}
    </div>
  );
};

export default Practice;