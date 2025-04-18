import { useEffect } from 'react';

const useShortcuts = (handlers) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if(e.shiftKey && key === 'delete') {
        e.preventDefault()
        handlers.onDelete?.();
      }

      if(e.shiftKey && key === 'd'){
        e.preventDefault()
        handlers.onDuplicate?.()
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};

export default useShortcuts