import React, { useEffect, useRef } from 'react';
import { XIcon, UserIcon } from './Icons';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
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
      aria-labelledby="profile-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-900/70 border border-gray-700/50 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-in-up relative">
        <button 
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-all transform hover:scale-110"
            aria-label="إغلاق"
        >
            <XIcon />
        </button>
        
        <div className="mb-5">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center ring-4 ring-sky-500/20">
                <UserIcon />
            </div>
        </div>

        <h1 id="profile-modal-title" className="text-sm font-semibold text-gray-400 mb-1 tracking-wider">تصميم وتنفيذ</h1>
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 mb-6">م. وائل الجـمّال</p>
        
        <div className="space-y-3 text-gray-200">
            <p className="text-sm text-gray-400">للاتصال</p>
            <p className="text-lg font-semibold tracking-widest" dir="ltr">012 223 557 69</p>
            <p className="text-lg font-semibold tracking-widest" dir="ltr">010 501 868 86</p>
        </div>
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
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;