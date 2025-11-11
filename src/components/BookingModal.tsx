import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    console.log('Form data before submission:', formData);

    if (!formData.projectType) {
      console.error('Project type is empty!');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description || formData.description.trim().length === 0) {
      console.error('Description is empty!');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        type: 'project',
        ...formData
      };
      console.log('Sending booking form:', payload);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to send email');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: '',
          description: ''
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log('Field changed:', e.target.name, '=', e.target.value);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-[90vw] max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 id="booking-modal-title" className="text-3xl font-bold text-white mb-2">Let's Explore</h2>
              <p className="text-slate-400 text-sm">Tell us about your project and let's bring your vision to life.</p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close booking form"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                Company/Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-slate-300 mb-2">
                Project or Learning Type <span className="text-red-400">*</span>
              </label>
              <select
                id="projectType"
                name="projectType"
                required
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center'
                }}
              >
                <option value="">Select type...</option>
                <option value="app-development">App Development</option>
                <option value="ai-video-production">AI-Assisted Video Production</option>
                <option value="content-strategy">Content Strategy</option>
                <option value="ai-automation">AI Automation</option>
                <option value="graphic-motion-design">Graphic/Motion Design</option>
                <option value="web-design">Web Design</option>
                <option value="social-media">Social Media</option>
                <option value="1-on-1-instructional">1-on-1 Instructional</option>
                <option value="group-learning">Group Learning</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Project Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your project, goals, key features, target audience, and any specific requirements..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
                Thank you! Your submission has been sent successfully.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                Sorry, there was an error sending your submission. Please try again.
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
