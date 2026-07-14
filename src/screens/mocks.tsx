import React from 'react';

const MockScreen: React.FC<any> = ({ onComplete, onBack, title }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-3xl font-bold mb-4 font-heading">{title || "Mock Screen"}</h1>
    {onComplete && <button onClick={() => onComplete(3)} className="btn-primary">Complete</button>}
    {onBack && <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">Go Back</button>}
  </div>
);

export const SplashScreen: React.FC<any> = (props) => <MockScreen title="Splash Screen" {...props} />;
export const ProfileSetup: React.FC<any> = (props) => <MockScreen title="Profile Setup" {...props} />;
export const LearnScreen: React.FC<any> = (props) => <MockScreen title="Learn Screen" {...props} />;
export const QuizScreen: React.FC<any> = (props) => <MockScreen title="Quiz Screen" {...props} />;
export const MemoryGame: React.FC<any> = (props) => <MockScreen title="Memory Game" {...props} />;
export const MatchGame: React.FC<any> = (props) => <MockScreen title="Match Game" {...props} />;
export const MathGame: React.FC<any> = (props) => <MockScreen title="Math Game" {...props} />;
export const WordBuilder: React.FC<any> = (props) => <MockScreen title="Word Builder" {...props} />;
export const ColoringBook: React.FC<any> = (props) => <MockScreen title="Coloring Book" {...props} />;
export const ProgressScreen: React.FC<any> = (props) => <MockScreen title="Progress Screen" {...props} />;
export const AchievementsScreen: React.FC<any> = (props) => <MockScreen title="Achievements Screen" {...props} />;
export const SettingsScreen: React.FC<any> = (props) => <MockScreen title="Settings Screen" {...props} />;
export const ProfileScreen: React.FC<any> = (props) => <MockScreen title="Profile Screen" {...props} />;
export const SkillsScreen: React.FC<any> = (props) => <MockScreen title="Skills Screen" {...props} />;

export default MockScreen;