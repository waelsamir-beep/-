import React, { useEffect, useRef } from 'react';
import { LayoutIcon, SwapIcon } from './Icons';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      aria-labelledby="welcome-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 text-center animate-fade-in-up">
        <h1 id="welcome-modal-title" className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 mb-3">أهلاً بك في استوديو المنتجات الذكي!</h1>
        <p className="text-gray-300 mb-8">دليلك السريع عشان تطلع صور احترافية لمنتجاتك في ثواني.</p>
        
        <div className="space-y-6 text-right">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-sky-900/50 text-sky-300 rounded-lg p-3">
              <LayoutIcon />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-100">استخدم خلفيات جاهزة (Mockups)</h2>
              <p className="text-gray-400">ارفع صورة منتجك، واختار من مكتبة خلفيات احترافية جاهزة عشان تحط منتجك فيها.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-sky-900/50 text-sky-300 rounded-lg p-3">
              <SwapIcon />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-100">ادمج منتجك في أي مشهد</h2>
              <p className="text-gray-400">ارفع صورة منتجك وصورة أي مشهد يعجبك، والذكاء الاصطناعي هيدمجهم بشكل واقعي.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          يلا نبدأ!
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
