
import React from 'react';
import type { Account } from '../../types.ts';
import { Icon } from './Icon.tsx';

// Simple Pie Chart component
const PieChart = ({ percentage, color, size = 100 }: { percentage: number, color: string, size?: number }) => {
    const strokeWidth = 12;
    const radius = (size / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className={color}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
        </svg>
    );
};

const StatDisplay = ({ icon, value, label, iconBgColor }: { icon: string, value: string | number, label: string, iconBgColor: string }) => (
    <div className="bg-white p-4 rounded-lg flex items-center gap-4 border border-gray-200/80">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon name={icon} className="w-5 h-5 text-white" />
        </div>
        <div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);


const PracticeAnalytics: React.FC<{ user: Account }> = ({ user }) => {
    const totalAttempted = user['Tổng số câu hỏi đã làm'] || 0;

    if (totalAttempted === 0) {
        return (
            <section className="bg-white p-6 rounded-2xl shadow-lg mb-12 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <Icon name="chart-bar" className="w-7 h-7 text-blue-600" />
                    Tổng quan tiến trình
                </h2>
                <div className="text-center py-12 px-4 bg-gray-50/70 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="animate-pulse">
                        <Icon name="chart-bar" className="w-16 h-16 mx-auto text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">Đang chờ dữ liệu luyện tập đầu tiên...</h3>
                    <p className="mt-2 text-gray-500">
                        Sau khi bạn hoàn thành một bài quiz, biểu đồ phân tích sẽ xuất hiện ở đây.
                    </p>
                </div>
            </section>
        );
    }
    
    const totalCorrect = user['Tổng số câu hỏi đã làm đúng'] || 0;
    const weeklyAttempted = user['Tổng số câu hỏi đã làm trong tuần'] || 0;
    const weeklyCorrect = user['Tổng số câu hỏi đã làm đúng trong tuần'] || 0;

    const totalAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const weeklyAccuracy = weeklyAttempted > 0 ? (weeklyCorrect / weeklyAttempted) * 100 : 0;
    
    return (
        <section className="bg-white p-6 rounded-2xl shadow-lg mb-12 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Icon name="chart-bar" className="w-7 h-7 text-blue-600" />
                Tổng quan tiến trình
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Side: Overall Stats */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl flex flex-col items-center justify-center text-center">
                    <h3 className="font-bold text-gray-800 text-lg">Thành tích tổng</h3>
                    <div className="relative my-4">
                        <PieChart percentage={totalAccuracy} color="text-blue-500" size={150} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold text-gray-800">{totalAccuracy.toFixed(0)}<span className="text-xl">%</span></span>
                        </div>
                    </div>
                    <p className="font-semibold text-gray-700">Tỷ lệ chính xác</p>
                    <p className="text-sm text-gray-500">Đúng {totalCorrect} / {totalAttempted} câu</p>
                </div>

                {/* Right Side: Weekly & Comparison Stats */}
                <div className="lg:col-span-3 bg-gray-50/70 p-6 rounded-xl space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Hoạt động tuần này</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-600">Câu đã làm</span>
                                <span className="font-bold text-gray-800">{weeklyAttempted}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${totalAttempted > 0 ? (weeklyAttempted / totalAttempted) * 100 : 0}%`, transition: 'width 1s ease-in-out' }}></div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-600">Độ chính xác</span>
                                <span className="font-bold text-gray-800">{weeklyAccuracy.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${weeklyAccuracy}%`, transition: 'width 1s ease-in-out' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-semibold text-gray-700 mb-4">Số liệu tổng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <StatDisplay icon="question" value={totalAttempted} label="Tổng câu đã làm" iconBgColor="bg-sky-500" />
                            <StatDisplay icon="checkmark" value={totalCorrect} label="Tổng câu đúng" iconBgColor="bg-green-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PracticeAnalytics;