import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface LoadingOverlayProps {
  productImageUrl: string | null;
}

const loadingMessages = [
  "جاري تحليل صورة المنتج...",
  "الذكاء الاصطناعي بيحضرلك المشهد...",
  "يتم الآن مطابقة الإضاءة والظلال...",
  "بنضيف اللمسات الإبداعية الأخيرة...",
  "الصور الاحترافية قربت تجهز...",
  "تحياتى .. وائل سمير ...",

];

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ productImageUrl }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-fast">
      <div className="relative w-48 h-48 mb-8">
        <div className="w-full h-full rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
          {productImageUrl ? (
            <img 
              src={productImageUrl} 
              alt="Product" 
              className="max-h-full max-w-full object-contain animate-pulse-slow"
            />
          ) : (
            <SparklesIcon />
          )}
        </div>
        <div className="scanner-line"></div>
      </div>
      
      <div className="relative h-6 w-full max-w-md overflow-hidden text-center">
        {loadingMessages.map((message, index) => (
          <p
            key={index}
            className={`absolute w-full transition-all duration-500 ease-in-out text-lg text-gray-300 ${
              index === currentMessageIndex
                ? 'opacity-100 transform-none'
                : 'opacity-0 transform translate-y-full'
            }`}
          >
            {message}
          </p>
        ))}
      </div>

      <style>{`
        @keyframes fade-in-fast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.3s ease-in-out forwards;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }

        @keyframes scan-effect {
            0% {
                top: -10%;
                opacity: 0.3;
            }
            50% {
                top: 110%;
                opacity: 0.7;
            }
            100% {
                top: -10%;
                opacity: 0.3;
            }
        }
        .scanner-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.8), transparent);
            border-radius: 50%;
            animation: scan-effect 3s infinite linear;
            box-shadow: 0 0 10px rgba(0, 224, 255, 0.7), 0 0 20px rgba(0, 224, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
