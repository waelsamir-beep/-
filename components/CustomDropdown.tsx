import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface CustomDropdownProps {
  category: string;
  options: { [key: string]: string };
  selectedMockup: string;
  onSelect: (prompt: string) => void;
  colors: {
    main: string;
    hover: string;
    ring: string;
    text: string;
    circle: string;
  };
  isAnySelected: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  category,
  options,
  selectedMockup,
  onSelect,
  colors,
  isAnySelected
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:ring-2 ${colors.ring} focus:border-transparent py-3 px-4 transition-all duration-200 text-right transform hover:scale-[1.02] ${isAnySelected ? 'border-transparent ring-2 ' + colors.ring.replace('focus:','') : ''}`}
      >
        <span className="truncate font-semibold">{category}</span>
        <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`absolute z-10 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 transition-all duration-200 ease-out transform origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="p-2 space-y-1">
          {Object.entries(options).map(([name, prompt]) => {
            const isSelected = selectedMockup === prompt;
            return (
              <button
                type="button"
                key={prompt}
                onClick={() => {
                  onSelect(prompt);
                  setIsOpen(false);
                }}
                className={`w-full text-right flex items-center gap-3 p-2.5 rounded-md transition-all duration-150 text-sm transform hover:-translate-x-1 ${
                  isSelected ? `${colors.main} text-white` : `text-gray-200 ${colors.hover}`
                }`}
              >
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
                    isSelected ? 'bg-white' : 'bg-gray-500'
                  }`}
                ></span>
                <span>{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;