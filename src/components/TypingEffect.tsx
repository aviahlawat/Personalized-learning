import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingEffect = ({ text, speed = 50, onComplete }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
      // Hide cursor after completion
      setTimeout(() => setShowCursor(false), 2000);
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setShowCursor(true);
  }, [text]);

  return (
    <div className="font-mono">
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {showCursor && <span className="typing-cursor"></span>}
    </div>
  );
};

export default TypingEffect;