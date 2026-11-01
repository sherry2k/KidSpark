import React, { useEffect } from 'react';
import SparkMascot from './SparkMascot';
import { playSparkVoice, stopSparkVoice } from '../utils/sparkVoice';

/**
 * Spark on a game's results screen: 3 stars: cheers. 2 stars: proud, slow happy wave. 1 star: kind 'that's okay' look. Says a line that fits.
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
      <SparkMascot mode={stars >= 3 ? 'cheer' : stars === 2 ? 'proud' : 'comfort'} className={className} />
    </div>
  );
};

export default SparkResult;
