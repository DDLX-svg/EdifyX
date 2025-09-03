
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { fetchPharmacyQuestions, fetchMedicineQuestions } from '../services/googleSheetService.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { MedicalQuestion } from '../types.ts';
import { Icon } from './shared/Icon.tsx';

type UserAnswer = {
    question: MedicalQuestion;
    selected: string;
    isCorrect: boolean;
};

const MedicalQuiz: React.FC = () => {
  const { specialty } = useParams<{ specialty: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state as { questions: number; time: number } | null;
  const { currentUser, updateUserStats } = useAuth();

  const [allQuestions, setAllQuestions] = useState<MedicalQuestion[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<MedicalQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const statsUpdated = useRef(false);

  useEffect(() => {
    const loadAllQuestions = async () => {
      if (!specialty) return;
      try {
        setIsLoading(true);
        const data = specialty === 'pharmacy' 
          ? await fetchPharmacyQuestions()
          : await fetchMedicineQuestions();
        setAllQuestions(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải câu hỏi. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllQuestions();
  }, [specialty]);

  useEffect(() => {
    if (config && allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(config.questions, allQuestions.length));
      setQuizQuestions(selectedQuestions);
      setTimeLeft(config.time * 60);
    }
  }, [config, allQuestions]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (!quizFinished) setQuizFinished(true);
      return;
    }
    if (!timeLeft || quizFinished) return;
    const intervalId = setInterval(() => setTimeLeft(t => t! - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, quizFinished]);

  useEffect(() => {
    const updateLocalStats = () => {
        if (!quizFinished || !currentUser || statsUpdated.current) return;

        statsUpdated.current = true; // Prevent re-running
        
        const attemptedCount = userAnswers.length;
        if (attemptedCount === 0) return;

        const correctCount = userAnswers.filter(a => a.isCorrect).length;
        updateUserStats(attemptedCount, correctCount);
    };

    if (quizFinished) {
      updateLocalStats();
    }
  }, [quizFinished, currentUser, userAnswers, updateUserStats]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.Correct_Answer;

    setUserAnswers(prev => [...prev, { question: currentQuestion, selected: selectedOption, isCorrect }]);
    
    setSelectedOption(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        setQuizFinished(true);
    }
  }, [selectedOption, currentQuestionIndex, quizQuestions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (quizFinished) return;
      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'a': case '1': handleOptionSelect('A'); break;
        case 'b': case '2': handleOptionSelect('B'); break;
        case 'c': case '3': handleOptionSelect('C'); break;
        case 'd': case '4': handleOptionSelect('D'); break;
        case 'enter':
          event.preventDefault(); 
          if (selectedOption) {
            handleSubmitAnswer();
          }
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizFinished, selectedOption, handleSubmitAnswer]);
  
  const restartQuiz = () => {
    statsUpdated.current = false; // Reset stats update flag
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setShowReview(false);
     if (config && allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(config.questions, allQuestions.length));
      setQuizQuestions(selectedQuestions);
      setTimeLeft(config.time * 60);
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!config) return <Navigate to="/practice" replace />;
  if (isLoading) return <div className="text-center p-10">Đang chuẩn bị dữ liệu...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!isLoading && allQuestions.length === 0) return <div className="text-center p-10">Không có câu hỏi nào cho chuyên khoa này.</div>;
  if (quizQuestions.length === 0) return <div className="text-center p-10">Đang tải câu hỏi...</div>

  if (quizFinished) {
    if (showReview) {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Xem lại bài làm</h2>
          <div className="space-y-6">
            {userAnswers.map((answer, index) => {
                const options = [
                    { key: 'A', text: answer.question.Option_A },
                    { key: 'B', text: answer.question.Option_B },
                    { key: 'C', text: answer.question.Option_C },
                    { key: 'D', text: answer.question.Option_D },
                ];
                return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                        <p className="font-bold text-gray-800 mb-4">Câu {index + 1}: {answer.question.Question_Text}</p>
                        <div className="space-y-3">
                            {options.map(opt => {
                                const isSelected = answer.selected === opt.key;
                                const isCorrect = answer.question.Correct_Answer === opt.key;
                                let classes = 'border-gray-200';
                                if (isCorrect) classes = 'bg-green-50 border-green-400 text-green-800';
                                else if (isSelected && !isCorrect) classes = 'bg-red-50 border-red-400 text-red-800';

                                return (
                                    <div key={opt.key} className={`p-3 border rounded-lg flex items-center ${classes}`}>
                                        {isSelected && <Icon name={isCorrect ? 'check-circle' : 'x-circle'} className={`w-5 h-5 mr-3 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />}
                                        <span className="font-semibold mr-2">{opt.key}.</span>
                                        <span>{opt.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {answer.question.Explanation && (
                            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm">
                                <p className="font-semibold text-blue-800">Giải thích:</p>
                                <p className="text-blue-700">{answer.question.Explanation}</p>
                            </div>
                        )}
                    </div>
                )
            })}
          </div>
          <button onClick={() => setShowReview(false)} className="mt-8 mx-auto flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition duration-300">
            <Icon name="arrow-uturn-left" className="w-5 h-5"/>
            Quay lại kết quả
          </button>
        </div>
      );
    }

    const score = userAnswers.filter(a => a.isCorrect).length;
    const percentage = userAnswers.length > 0 ? Math.round((score / userAnswers.length) * 100) : 0;
    const resultColor = percentage >= 50 ? 'text-green-600' : 'text-red-600';

    return (
      <div className="text-center max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{timeLeft === 0 ? "Hết giờ!" : "Hoàn thành!"}</h2>
        
        <div className="my-6">
            <p className="text-lg text-gray-600">Điểm của bạn</p>
            <p className={`text-6xl font-extrabold ${resultColor}`}>{percentage}%</p>
            <p className="text-gray-700 font-medium">Đúng <span className="font-bold">{score}</span> trên <span className="font-bold">{userAnswers.length}</span> câu</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={restartQuiz} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                <Icon name="refresh" className="w-5 h-5" /> Làm lại
            </button>
            <button onClick={() => setShowReview(true)} disabled={userAnswers.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300 disabled:bg-gray-400">
                <Icon name="eye" className="w-5 h-5" /> Xem lại bài làm
            </button>
        </div>
        <button onClick={() => navigate('/practice')} className="mt-4 text-gray-600 font-semibold hover:text-blue-600 transition">
            Quay về trang luyện tập
        </button>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;
  
  const options = [
    { key: 'A', text: currentQuestion.Option_A },
    { key: 'B', text: currentQuestion.Option_B },
    { key: 'C', text: currentQuestion.Option_C },
    { key: 'D', text: currentQuestion.Option_D },
  ];
  
  const actualQuestionCount = Math.min(config.questions, allQuestions.length);
  const quizTitle = specialty === 'pharmacy' ? 'Luyện tập Dược học' : 'Luyện tập Y đa khoa';

  return (
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{quizTitle}</h1>
            {actualQuestionCount < config.questions && (
                 <p className="flex items-center justify-center gap-2 text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md mt-4">
                    <Icon name="information-circle" className="w-5 h-5 flex-shrink-0" />
                    <span>Lưu ý: Bạn đã chọn {config.questions} câu, nhưng chuyên mục này chỉ có {actualQuestionCount} câu hỏi có sẵn.</span>
                </p>
            )}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Câu {currentQuestionIndex + 1}/{quizQuestions.length}</h2>
            {timeLeft !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                <Icon name="clock" className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
            </div>
            )}
        </div>
        <p className="text-lg font-semibold mb-6 min-h-[6rem]">{currentQuestion.Question_Text}</p>
        
        <div className="space-y-4">
            {options.map(opt => {
                const isSelected = selectedOption === opt.key;
                const optionClass = isSelected 
                    ? "border-blue-500 bg-blue-100 ring-2 ring-blue-500"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50";
            
            return (
                <button
                key={opt.key}
                onClick={() => handleOptionSelect(opt.key)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 min-h-[5rem] flex items-center ${optionClass}`}
                >
                <div>
                    <span className="font-bold mr-3">{opt.key}.</span>
                    {opt.text}
                </div>
                </button>
            )
            })}
        </div>
        
        <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            Tiếp theo
        </button>
        </div>
    </div>
  );
};

export default MedicalQuiz;