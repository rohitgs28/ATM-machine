
import { useEffect } from 'react';

type SetPin = (s: string | ((prev: string) => string)) => void;


export const usePinKeyboard = (
  pin: string,
  setPin: SetPin, // pass the setter function itself
  pinInputRef: React.RefObject<HTMLInputElement>,
  onEnter: (currentPin: string) => void,
) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === pinInputRef.current) return;

      if (/^[0-9]$/.test(e.key)) {
        setPin((p: string) => (p + e.key).slice(0, 4)); 
      } else if (e.key === 'Backspace') {
        setPin((p: string) => p.slice(0, -1));
        e.preventDefault();
      } else if (e.key === 'Enter' && /^\d{4}$/.test(pin)) {
        onEnter(pin);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // deps: pass references (no function calls)
  }, [pin, setPin, pinInputRef, onEnter]);
};

export default usePinKeyboard;
