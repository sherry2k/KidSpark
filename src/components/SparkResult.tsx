import React, { useEffect } from 'react';
import SparkMascot from './SparkMascot';
import { playSparkVoice, stopSparkVoice } from '../utils/sparkVoice';

/**
 * Spark on a game's results screen: cheers (or waves gently) and says a line that fits the stars.
 * Usage:  <SparkResult stars={stars} />
 */
const SparkResult: React.FC<{ stars: number; className?: string }> = ({ stars, className = 'w-28' }) => {
  useEffect(() => {
    const group = stars >= 3 ? 'result3' : stars === 2 ? 'result2' : 'result1';
    playSparkVoice(group, 700);
    return () => stopSparkVoice();
  }, [stars]);

  return (
    <div className="flex justify-center" style={{ marginTop: 16 }}>
      <SparkMascot mode={stars >= 2 ? 'cheer' : 'wave'} className={className} />
    </div>
  );
};

export default SparkResult;
