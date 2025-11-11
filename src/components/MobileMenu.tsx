import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onContactClick: () => void;
  onBookingClick: () => void;
}

export default function MobileMenu({ isOpen, onClose, onContactClick, onBookingClick }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContactClick = () => {
    onClose();
    onContactClick();
  };

  const handleBookingClick = () => {
    onClose();
    onBookingClick();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[99998] bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 h-screen w-80 max-w-[80vw] z-[99999] bg-slate-950 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-6 space-y-4">
          <a
            href="#services"
            onClick={onClose}
            className="block text-lg text-gray-300 hover:text-white transition-colors py-2"
          >
            Services
          </a>
          <a
            href="#capabilities"
            onClick={onClose}
            className="block text-lg text-gray-300 hover:text-white transition-colors py-2"
          >
            Capabilities
          </a>
          <a
            href="#portfolio"
            onClick={onClose}
            className="block text-lg text-gray-300 hover:text-white transition-colors py-2"
          >
            Portfolio
          </a>
          <a
            href="#about"
            onClick={onClose}
            className="block text-lg text-gray-300 hover:text-white transition-colors py-2"
          >
            About
          </a>
        </nav>
      </div>
    </>
  );
}
