import React from 'react';

const Marquee: React.FC = () => {
  const text = "تصميم وتنفيذ م. وائل الجـمّال  •  للاتصال: 01222355769 - 01050186886";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-sm border-t border-gray-800/50 flex justify-center items-center py-2">
      <p className="font-semibold px-4 text-sm text-white">{text}</p>
    </div>
  );
};

export default Marquee;
