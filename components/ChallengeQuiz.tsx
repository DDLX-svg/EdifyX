
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { fetchAllQuestions } from '../services/googleSheetService.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { AnyQuestion, MedicalQuestion } from '../types.ts';
import { Icon } from './shared/Icon.tsx';

type UserAnswer = {
    question: AnyQuestion;
    selected: string;
    isCorrect: boolean;
};

const QuestionDisplay: React.FC<{ question: AnyQuestion }> = ({ question }) => {
    if (question.type === 'Anatomy') {
         return <p>Câu hỏi giải phẫu không được hỗ trợ trong chế độ này.</p>;
    }
    return <p className="text-lg font-semibold mb-6 min-h-[6rem]">{question.Question_Text}</p>;
};

const ChallengeQuiz: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, updateUserStats } = useAuth();
    const config = location.state as { questions: number; time: number } | null;

    const [allQuestions, setAllQuestions] = useState<AnyQuestion[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<AnyQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const statsUpdated = useRef(false);

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            try {
                const all = await fetchAllQuestions();
                const mcqQuestions = all.filter(q => q.type === 'Medicine' || q.type === 'Pharmacy');
                setAllQuestions(mcqQuestions);
            } catch (err) {
                setError('Không thể tải câu hỏi. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, []);

    useEffect(() => {
        if (config && allQuestions.length > 0) {
            const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(config.questions, allQuestions.length));
            setQuizQuestions(selected);
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
            const attempted = userAnswers.length;
            if (attempted === 0) return;

            const score = userAnswers.filter(a => a.isCorrect).length;
            updateUserStats(attempted, score);
        };

        if (quizFinished) {
            updateLocalStats();
        }
    }, [quizFinished, currentUser, userAnswers, updateUserStats]);

    const handleSubmitAnswer = useCallback(() => {
        if (selectedOption === null) return;

        const currentQuestion = quizQuestions[currentQuestionIndex];
        if (currentQuestion.type === 'Anatomy') return;

        const isCorrect = selectedOption === (currentQuestion as MedicalQuestion).Correct_Answer;
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
                case 'a': case '1': setSelectedOption('A'); break;
                case 'b': case '2': setSelectedOption('B'); break;
                case 'c': case '3': setSelectedOption('C'); break;
                case 'd': case '4': setSelectedOption('D'); break;
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


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    
    if (!config) return <Navigate to="/leaderboard" replace />;
    if (isLoading) return <div className="text-center p-10">Đang chuẩn bị thử thách...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!isLoading && quizQuestions.length === 0) return <div className="text-center p-10">Không đủ câu hỏi để bắt đầu. Vui lòng thử lại sau.</div>;
    
    const score = userAnswers.filter(a => a.isCorrect).length;

    if (quizFinished) {
        const attemptedCount = userAnswers.length;
        const percentage = attemptedCount > 0 ? Math.round((score / attemptedCount) * 100) : 0;
        return (
            <div className="text-center max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold mb-4">{timeLeft === 0 ? "Hết giờ!" : "Hoàn thành!"}</h2>
                 
                <div className="my-6">
                    <p className="text-lg text-gray-600">Điểm của bạn</p>
                    <p className={`text-6xl font-extrabold ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</p>
                    <p className="text-gray-700 font-medium">Đúng <span className="font-bold">{score}</span> trên <span className="font-bold">{attemptedCount}</span> câu</p>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                     <button onClick={() => navigate('/leaderboard', { replace: true })} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                        <Icon name="trophy" className="w-5 h-5" /> Xem bảng xếp hạng
                    </button>
                </div>
            </div>
        );
    }
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (!currentQuestion) return <div className="text-center p-10">Đang tải câu hỏi tiếp theo...</div>;
    if (currentQuestion.type === 'Anatomy') return null;

    const options = [
        { key: 'A', text: (currentQuestion as MedicalQuestion).Option_A },
        { key: 'B', text: (currentQuestion as MedicalQuestion).Option_B },
        { key: 'C', text: (currentQuestion as MedicalQuestion).Option_C },
        { key: 'D', text: (currentQuestion as MedicalQuestion).Option_D },
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8"><h1 className="text-3xl font-bold">Thử thách hàng tuần</h1></div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Câu {currentQuestionIndex + 1}/{quizQuestions.length}</h2>
                    {timeLeft !== null && <div className="flex items-center gap-2 text-lg font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full"><Icon name="clock" className="w-5 h-5" /><span>{formatTime(timeLeft)}</span></div>}
                </div>
                
                <QuestionDisplay question={currentQuestion} />
                
                <div className="space-y-4">
                    {options.map(opt => (
                        <button key={opt.key} onClick={() => setSelectedOption(opt.key)} className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 min-h-[5rem] flex items-center ${selectedOption === opt.key ? "border-blue-500 bg-blue-100 ring-2 ring-blue-500" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"}`}>
                            <div><span className="font-bold mr-3">{opt.key}.</span>{opt.text}</div>
                        </button>
                    ))}
                </div>
                
                <button onClick={handleSubmitAnswer} disabled={selectedOption === null} className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default ChallengeQuiz;
