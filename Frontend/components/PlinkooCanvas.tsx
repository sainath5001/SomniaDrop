'use client';

import { useEffect, useRef, useState } from 'react';
import { BallManager } from '@/game/BallManager';

interface PlinkooCanvasProps {
  pattern: number[];
  outcome: number;
  onAnimationComplete?: (outcome: number) => void;
  isPlaying: boolean;
}

export function PlinkooCanvas({ pattern, outcome, onAnimationComplete, isPlaying }: PlinkooCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballManagerRef = useRef<BallManager | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 800;

    if (!ballManagerRef.current) {
      ballManagerRef.current = new BallManager(canvas);
    }

    return () => {
      if (ballManagerRef.current) {
        ballManagerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && pattern.length > 0 && outcome >= 0 && ballManagerRef.current) {
      setIsAnimating(true);
      // Small delay to ensure canvas is ready
      const timer = setTimeout(() => {
        if (ballManagerRef.current) {
      ballManagerRef.current.startGame(
        pattern,
        outcome,
        (completedOutcome) => {
          setIsAnimating(false);
          onAnimationComplete?.(completedOutcome);
        }
      );
        }
      }, 50);
      
      return () => clearTimeout(timer);
    } else if (!isPlaying && ballManagerRef.current) {
      ballManagerRef.current.reset();
      setIsAnimating(false);
    }
  }, [isPlaying, pattern, outcome, onAnimationComplete]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-blue-50 to-blue-100"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}



