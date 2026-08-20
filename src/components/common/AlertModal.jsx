import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  X,
  Sparkles
} from 'lucide-react';

export default function AlertModal({
  isOpen,
  type = 'info', // 'success', 'danger', 'warning', 'info', 'error'
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  isConfirm = false,
  onConfirm,
  onClose,
  customIcon = null
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose?.();
  };

  // Get icon and color scheme based on type
  const renderIcon = () => {
    if (customIcon) return customIcon;

    switch (type) {
      case 'success':
        return (
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center animate-pulse-glow-success">
            <CheckCircle2 size={34} className="text-emerald-600 dark:text-emerald-400 animate-alert-pop" />
          </div>
        );
      case 'danger':
      case 'delete':
        return (
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center animate-pulse-glow-danger">
            <Trash2 size={32} className="text-red-500 dark:text-red-400 animate-alert-shake" />
          </div>
        );
      case 'error':
        return (
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center animate-pulse-glow-danger">
            <AlertCircle size={34} className="text-red-500 dark:text-red-400 animate-alert-shake" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center animate-pulse-glow-warning">
            <AlertTriangle size={34} className="text-amber-500 dark:text-amber-400 animate-alert-wiggle" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center animate-pulse-glow-info">
            <Info size={34} className="text-blue-600 dark:text-blue-400 animate-alert-pop" />
          </div>
        );
    }
  };

  // Default button texts based on type
  const defaultConfirmText = isConfirm 
    ? (type === 'danger' || type === 'delete' ? 'Delete' : 'Confirm')
    : 'OK';

  const finalConfirmText = confirmText || defaultConfirmText;

  const getConfirmButtonClass = () => {
    if (type === 'danger' || type === 'delete' || type === 'error') {
      return 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-500/20 text-white';
    }
    if (type === 'success') {
      return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20 text-white';
    }
    if (type === 'warning') {
      return 'bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-500/20 text-white';
    }
    return 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 text-white';
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {renderIcon()}
        </div>

        {/* Title */}
        {title && (
          <h3 id="alert-modal-title" className="text-xl font-bold text-gray-800 dark:text-zinc-100 text-center mb-2">
            {title}
          </h3>
        )}

        {/* Message */}
        {message && (
          <p className="text-gray-600 dark:text-zinc-400 text-center mb-6 text-sm leading-relaxed whitespace-pre-line">
            {message}
          </p>
        )}

        {/* Buttons */}
        {isConfirm ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 font-medium rounded-md transition-all cursor-pointer text-sm shadow-sm ${getConfirmButtonClass()}`}
            >
              {finalConfirmText}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full px-4 py-2.5 font-medium rounded-md transition-all cursor-pointer text-sm shadow-sm ${getConfirmButtonClass()}`}
            >
              {finalConfirmText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
