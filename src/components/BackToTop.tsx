import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 left-8 z-40 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  );
}
