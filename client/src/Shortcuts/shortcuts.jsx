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

      if(e.ctrlKey && key === 'z'){
        e.preventDefault()
        handlers.goBack?.()
      }

      if(e.ctrlKey && key === 'y'){
        e.preventDefault()
        handlers.goForward?.()
      }

      if(e.ctrlKey && e.shiftKey && key === 'delete'){
        e.preventDefault()
        handlers.onDeleteAll?.()
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};

export default useShortcuts