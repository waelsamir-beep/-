import React from 'react';
import { EditIcon } from './Icons';

interface HistoryTrayProps {
  history: string[];
  currentImageUrl: string;
  onSelect: (url: string) => void;
  onReuse: (url: string) => void;
}

const HistoryTray: React.FC<HistoryTrayProps> = ({ history, currentImageUrl, onSelect, onReuse }) => {
  return (
    <div className="w-full mt-10">
      <h2 className="text-lg font-semibold text-gray-200 mb-4 text-center">كل الصور اللي عملتها</h2>
      <div className="flex gap-4 overflow-x-auto p-4 bg-black/50 rounded-lg border border-gray-800 snap-x snap-mandatory">
        {history.map((imageUrl, index) => (
          <div
            key={index}
            className={`relative group flex-shrink-0 w-28 h-28 rounded-lg cursor-pointer transition-all duration-200 snap-center transform hover:scale-105 ${currentImageUrl === imageUrl ? 'ring-4 ring-sky-500 shadow-lg' : 'ring-2 ring-gray-700 hover:ring-sky-500'}`}
            onClick={() => onSelect(imageUrl)}
            role="button"
            aria-label={`اختار صورة رقم ${index + 1}`}
            tabIndex={0}
          >
            <img src={imageUrl} alt={`صورة رقم ${index + 1}`} className="w-full h-full object-cover rounded-md" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReuse(imageUrl);
                }}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-xs py-1 px-2 rounded-full hover:bg-sky-600 transition-all duration-200 transform hover:scale-105"
                title="استخدم الصورة دي كصورة أساسية"
              >
                <EditIcon />
                استخدم دي
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryTray;