import React from 'react';
import { RefreshIcon } from './Icons';

interface ImageSelectionProps {
  urls: [string, string];
  onSelect: (url: string) => void;
  onGoBack: () => void;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({ urls, onSelect, onGoBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20">
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500 mb-4">النتيجة جاهزة! اختار التصميم الأفضل</h1>
        <p className="text-gray-300 mb-8">دوس على الصورة اللي عجبتك عشان تقارنها بالأصلية أو تكمل تعديل.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {urls.map((url, index) => (
          <div
            key={index}
            className="group relative cursor-pointer aspect-square rounded-lg overflow-hidden ring-2 ring-gray-800 hover:ring-sky-500 focus-within:ring-sky-500 transition-all duration-300 shadow-2xl transform hover:scale-[1.03] animate-fade-in-up"
            onClick={() => onSelect(url)}
            onKeyPress={(e) => e.key === 'Enter' && onSelect(url)}
            style={{ animationDelay: `${index * 150}ms` }}
            tabIndex={0}
            role="button"
            aria-label={`اختيار التصميم رقم ${index + 1}`}
          >
            <img src={url} alt={`Generated Result ${index + 1}`} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xl font-bold transform transition-transform duration-300 group-hover:translate-y-0 translate-y-4">اختار التصميم ده</span>
            </div>
          </div>
        ))}
      </div>

       <div className="w-full max-w-2xl mx-auto text-center mt-12">
           <button 
              onClick={onGoBack}
              className="w-full max-w-xs mx-auto bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshIcon />
              جرب مرة تانية
            </button>
        </div>
        <style>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
            opacity: 0;
          }
      `}</style>
    </div>
  );
};

export default ImageSelection;