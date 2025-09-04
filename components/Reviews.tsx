
import React from 'react';
import { Icon } from './shared/Icon.tsx';

// Dummy data for reviews
const reviews = [
  {
    name: 'An Nguyên',
    role: 'Sinh viên Y Khoa',
    rating: 5,
    comment: 'EdifyX là nền tảng tuyệt vời nhất tôi từng sử dụng để học giải phẫu. Giao diện trực quan và các câu hỏi rất sát với thực tế thi cử.',
  },
  {
    name: 'Trần Bảo',
    role: 'Học sinh THPT',
    rating: 5,
    comment: 'Nhờ có EdifyX, em đã tự tin hơn rất nhiều với kiến thức Sinh học. Phần luyện tập thực sự giúp em củng cố kiến thức đã học trên lớp.',
  },
  {
    name: 'Lê Minh Anh',
    role: 'Bác sĩ nội trú',
    rating: 4.5,
    comment: 'Kho tài liệu rất phong phú và được cập nhật thường xuyên. Đây là một nguồn tham khảo đáng tin cậy cho công việc của tôi.',
  },
  {
    name: 'Phạm Thị Thu Hà',
    role: 'Sinh viên Dược',
    rating: 5,
    comment: 'Module Dược học có các câu hỏi tình huống rất hay, giúp mình vận dụng lý thuyết vào thực tế. Rất khuyến khích các bạn sinh viên Dược dùng thử!',
  },
  {
    name: 'Hoàng Quốc Việt',
    role: 'Nhà nghiên cứu',
    rating: 5,
    comment: 'Tính năng đăng tải và bình duyệt nghiên cứu rất tiềm năng. Mong rằng cộng đồng sẽ ngày càng phát triển mạnh mẽ hơn.',
  },
  {
    name: 'Vũ Ngọc Mai',
    role: 'Sinh viên Y Khoa',
    rating: 5,
    comment: 'Chức năng thi chạy trạm giải phẫu "cứu" mình qua kỳ thi vừa rồi. Giao diện mô phỏng y hệt thi thật!',
  },
  {
    name: 'Đặng Tuấn Kiệt',
    role: 'Học sinh chuyên Sinh',
    rating: 4.5,
    comment: 'App rất hữu ích cho việc ôn luyện thi HSG. Em hy vọng sẽ có thêm nhiều câu hỏi ở các chuyên đề sâu hơn nữa.',
  },
  {
    name: 'Nguyễn Phương Thảo',
    role: 'Bác sĩ đa khoa',
    rating: 5,
    comment: 'Một công cụ tuyệt vời để ôn lại kiến thức và cập nhật các hướng dẫn mới. Tôi thường dùng EdifyX trong thời gian rảnh.',
  },
   {
    name: 'Bùi Thế Hùng',
    role: 'Sinh viên Y Khoa',
    rating: 5,
    comment: 'Giao diện thân thiện, dễ sử dụng. Nội dung chất lượng. 5 sao cho EdifyX!',
  },
  {
    name: 'Trịnh Lan Hương',
    role: 'Dược sĩ',
    rating: 4.5,
    comment: 'Rất ấn tượng với chất lượng của nền tảng. EdifyX là một nguồn tài nguyên quý giá cho cả sinh viên và người đi làm trong ngành y.',
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <Icon key={`full-${i}`} name="star" className="w-5 h-5" />)}
      {halfStar && (
        <div className="relative">
          <Icon key="half" name="star" className="w-5 h-5 text-gray-300" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <Icon key="half-fill" name="star" className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => <Icon key={`empty-${i}`} name="star" className="w-5 h-5 text-gray-300" />)}
    </div>
  );
};


const ReviewCard: React.FC<{ review: typeof reviews[0] }> = ({ review }) => (
  <div className="flex-shrink-0 w-[350px] bg-white p-6 rounded-2xl shadow-lg mx-4 border-t-4 border-blue-500">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600 mr-4">
        {review.name.charAt(0)}
      </div>
      <div>
        <p className="font-bold text-gray-800">{review.name}</p>
        <p className="text-sm text-gray-500">{review.role}</p>
      </div>
    </div>
    <StarRating rating={review.rating} />
    <p className="mt-4 text-gray-600 italic">"{review.comment}"</p>
  </div>
);

const Reviews: React.FC = () => {
    // Duplicate reviews for seamless scrolling effect
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <>
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-${reviews.length * (350 + 32)}px); }
                }
                .scroller-inner {
                    animation: scroll 60s linear infinite;
                }
                .scroller:hover .scroller-inner {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="w-full overflow-hidden scroller" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
                <div className="flex w-max scroller-inner py-4">
                    {duplicatedReviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Reviews;
