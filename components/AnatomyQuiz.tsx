
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { fetchAnatomyQuestions } from '../services/googleSheetService';
import { useAuth } from '../contexts/AuthContext';
import type { AnatomyQuestion } from '../types';
import { Icon } from './shared/Icon';

type UserAnswer = {
    question: AnatomyQuestion;
    clickX: number;
    clickY: number;
    isCorrect: boolean;
};

type QuizOption = {
    questions: number;
    time: number;
};

const ReviewItem: React.FC<{ answer: UserAnswer; index: number }> = ({ answer, index }) => {
    const { question, clickX, clickY, isCorrect } = answer;
    const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
    const [centerX, centerY, radius] = question.Correct_Coordinates.split(',').map(Number);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImgDims({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="font-bold text-gray-800 mb-4">Câu {index + 1}: {question.Question_Text}</p>
            <div className="relative inline-block w-full">
                <img 
                    src={question.Image_URL} 
                    alt="Anatomy Diagram" 
                    className="w-full h-auto rounded-lg" 
                    referrerPolicy="no-referrer" 
                    onLoad={handleImageLoad} 
                />
                {imgDims.width > 0 && (
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${imgDims.width} ${imgDims.height}`}>
                        <circle 
                            cx={centerX} 
                            cy={centerY} 
                            r={radius} 
                            stroke="rgba(34, 197, 94, 0.7)" 
                            fill="rgba(34, 197, 94, 0.3)" 
                            strokeWidth="10" 
                            strokeDasharray="20 10" 
                        />
                        {isCorrect ? (
                            <circle cx={clickX} cy={clickY} r="15" fill="none" stroke="#16a34a" strokeWidth="10" />
                        ) : (
                            <g transform={`translate(${clickX}, ${clickY})`}>
                                <path d="M -15 -15 L 15 15" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                                <path d="M 15 -15 L -15 15" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
                            </g>
                        )}
                    </svg>
                )}
            </div>
        </div>
    );
};


const AnatomyQuiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state as QuizOption | null;

  const [allQuestions, setAllQuestions] = useState<AnatomyQuestion[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<AnatomyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [actualQuestionCount, setActualQuestionCount] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const { currentUser, updateUserStats } = useAuth();

  useEffect(() => {
    const loadAndSetupQuiz = async () => {
      if (!config) return;
      try {
        setIsLoading(true);
        const data = await fetchAnatomyQuestions();
        setAllQuestions(data);
        
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(config.questions, data.length));
        
        setQuizQuestions(selectedQuestions);
        setActualQuestionCount(selectedQuestions.length);
        setTimeLeft(config.time * 60);
        setError(null);
      } catch (err) {
        setError('Không thể tải câu hỏi. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAndSetupQuiz();
  }, [config]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      if (!quizFinished) setQuizFinished(true);
      return;
    }
    if (!timeLeft || quizFinished || feedback) return;
    const intervalId = setInterval(() => setTimeLeft(t => t! - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft, quizFinished, feedback]);

  useEffect(() => {
    const updateLocalStats = () => {
        if (!quizFinished || !currentUser) return;
        
        const attemptedCount = userAnswers.length;
        if (attemptedCount === 0) return;

        const correctCount = userAnswers.filter(a => a.isCorrect).length;
        updateUserStats(attemptedCount, correctCount);
    };
    
    if (quizFinished) {
      updateLocalStats();
    }
  }, [quizFinished, currentUser, userAnswers, updateUserStats]);
  
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (feedback) return;

    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const [centerX, centerY, radius] = currentQuestion.Correct_Coordinates.split(',').map(Number);

    const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
    const isCorrect = distance <= radius;

    setUserAnswers(prev => [...prev, { question: currentQuestion, clickX, clickY, isCorrect }]);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };
  
  const restartQuiz = () => {
    navigate('/practice');
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!config) {
    return <Navigate to="/practice" replace />;
  }

  if (isLoading) {
    return <div className="text-center p-10">Đang chuẩn bị câu hỏi...</div>;
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }
  
  if (quizFinished) {
    if (showReview) {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Xem lại bài làm</h2>
          <div className="space-y-8">
            {userAnswers.map((answer, index) => (
               <ReviewItem key={index} answer={answer} index={index} />
            ))}
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
                <Icon name="refresh" className="w-5 h-5" /> Chọn lại
            </button>
            <button onClick={() => setShowReview(true)} disabled={userAnswers.length === 0} className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300 disabled:bg-gray-400">
                <Icon name="eye" className="w-5 h-5" /> Xem lại bài làm
            </button>
        </div>
        <button onClick={() => navigate('/')} className="mt-4 text-gray-600 font-semibold hover:text-blue-600 transition">
            Quay về trang chủ
        </button>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;
  
  const score = userAnswers.filter(a => a.isCorrect).length;
  const progressPercentage = quizQuestions.length > 0 ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 : 0;

  return (
    <div>
        <style>{`
            @keyframes zoom-in-fade {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-zoom-in-fade {
                animation: zoom-in-fade 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
        `}</style>
        <div className="text-center mb-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Mô phỏng thi chạy trạm</h1>
            {actualQuestionCount < config.questions && (
                 <p className="flex items-center justify-center gap-2 text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md mt-4">
                    <Icon name="information-circle" className="w-5 h-5 flex-shrink-0" />
                    <span>Lưu ý: Bạn đã chọn {config.questions} câu, nhưng chuyên mục này chỉ có {actualQuestionCount} câu hỏi có sẵn.</span>
                </p>
            )}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Câu {currentQuestionIndex + 1}/{quizQuestions.length}</h2>
                {timeLeft !== null && (
                  <div className="flex items-center gap-2 text-lg font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      <Icon name="clock" className="w-5 h-5" />
                      <span>{formatTime(timeLeft)}</span>
                  </div>
                )}
                <div className="text-lg font-semibold text-blue-600">Điểm: {score}</div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <p className="text-lg text-center font-semibold mb-4">{currentQuestion.Question_Text}</p>
            <div className="relative cursor-pointer">
              <img
                ref={imageRef}
                src={currentQuestion.Image_URL}
                alt="Anatomy Diagram"
                onClick={handleImageClick}
                className="w-full h-auto rounded-lg"
                referrerPolicy="no-referrer"
              />
              {feedback && (
                  <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${feedback === 'correct' ? 'bg-green-500/50' : 'bg-red-500/50'}`}>
                      <div className="animate-zoom-in-fade">
                          <Icon name={feedback === 'correct' ? 'check-circle' : 'x-circle'} className="w-24 h-24 text-white" />
                      </div>
                  </div>
              )}
            </div>
        </div>
    </div>
  );
};

export default AnatomyQuiz;
