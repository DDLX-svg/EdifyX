import React from 'react';
import type { Account } from '../../types.ts';
import { Icon } from './Icon.tsx';

// Simple Pie Chart component
const PieChart = ({ percentage, color, size = 100 }: { percentage: number, color: string, size?: number }) => {
    const strokeWidth = 10;
    const radius = (size / 2) - strokeWidth;
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
            />
        </svg>
    );
};

const StatDisplay = ({ icon, value, label, iconBgColor }: { icon: string, value: string | number, label: string, iconBgColor: string }) => (
    <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

// New, improved Bar component for the chart
const Bar = ({ percentage, color, label, value }: { percentage: number; color: string; label: string; value: number }) => {
    // Ensure there's a minimum visible height for zero values for better UX
    const barHeight = percentage > 1 ? `${percentage}%` : '2px';

    return (
        <div className="flex flex-col items-center w-24 group">
            <div className="relative w-full h-40 bg-gray-200/70 rounded-lg flex flex-col-reverse">
                <div
                    className={`${color} w-full rounded-lg transition-all duration-700 ease-out transform group-hover:scale-x-105`}
                    style={{ height: barHeight }}
                    title={`${label}: ${value}`}
                />
                 {/* Tooltip for the value */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-sm font-bold bg-gray-900 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                        {value}
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
                </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700 text-center w-full">{label}</p>
        </div>
    );
};


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

    const totalAccuracy = (totalCorrect / totalAttempted) * 100;
    const weeklyAccuracy = weeklyAttempted > 0 ? (weeklyCorrect / weeklyAttempted) * 100 : 0;
    
    const maxBarValue = Math.max(totalAttempted, weeklyAttempted, 1);
    const barData = [
        { percentage: (totalAttempted / maxBarValue) * 100, color: 'bg-sky-500', label: 'Tổng làm', value: totalAttempted },
        { percentage: (totalCorrect / maxBarValue) * 100, color: 'bg-green-500', label: 'Tổng đúng', value: totalCorrect },
        { percentage: (weeklyAttempted / maxBarValue) * 100, color: 'bg-orange-500', label: 'Tuần này làm', value: weeklyAttempted },
        { percentage: (weeklyCorrect / maxBarValue) * 100, color: 'bg-amber-500', label: 'Tuần này đúng', value: weeklyCorrect }
    ];

    return (
        <section className="bg-white p-6 rounded-2xl shadow-lg mb-12 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Icon name="chart-bar" className="w-7 h-7 text-blue-600" />
                Tổng quan tiến trình
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center">
                    <div className="relative">
                        <PieChart percentage={totalAccuracy} color="text-blue-500" size={120} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">{totalAccuracy.toFixed(0)}<span className="text-lg">%</span></span>
                        </div>
                    </div>
                    <p className="mt-3 font-semibold text-gray-700">Tỷ lệ chính xác tổng</p>
                    <p className="text-sm text-gray-500">Đúng {totalCorrect} / {totalAttempted} câu</p>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatDisplay icon="question" value={totalAttempted} label="Tổng câu đã làm" iconBgColor="bg-sky-500" />
                    <StatDisplay icon="checkmark" value={totalCorrect} label="Tổng câu đúng" iconBgColor="bg-green-500" />
                    <StatDisplay icon="flame" value={weeklyAttempted} label="Câu đã làm (tuần này)" iconBgColor="bg-orange-500" />
                    <StatDisplay icon="target" value={`${weeklyAccuracy.toFixed(0)}%`} label="Chính xác (tuần này)" iconBgColor="bg-amber-500" />
                </div>

                <div className="md:col-span-3 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">So sánh thành tích</h3>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 pt-8">
                        <div className="text-center">
                            <p className="font-bold text-gray-800 mb-4">Tổng cộng</p>
                            <div className="flex items-end gap-4">
                                <Bar {...barData[0]} />
                                <Bar {...barData[1]} />
                            </div>
                        </div>
                        <div className="h-32 w-px bg-gray-300 hidden sm:block"></div>
                        <div className="text-center">
                            <p className="font-bold text-gray-800 mb-4">Tuần này</p>
                            <div className="flex items-end gap-4">
                                <Bar {...barData[2]} />
                                <Bar {...barData[3]} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PracticeAnalytics;
