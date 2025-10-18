import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { Chip } from '../components/Chip';
import { BookOpenIcon, BrainIcon, LineChartIcon, HeartIcon, UsersIcon } from 'lucide-react';
const goals = [{
  id: 'leadership',
  label: 'Improve Leadership',
  icon: <UsersIcon size={16} />
}, {
  id: 'ai',
  label: 'Learn about AI',
  icon: <BrainIcon size={16} />
}, {
  id: 'finance',
  label: 'Personal Finance',
  icon: <LineChartIcon size={16} />
}, {
  id: 'health',
  label: 'Health & Wellness',
  icon: <HeartIcon size={16} />
}, {
  id: 'fiction',
  label: 'Enjoy Fiction',
  icon: <BookOpenIcon size={16} />
}];
const genres = ['Business', 'Self-Help', 'Psychology', 'Science', 'Fiction', 'Biography', 'History', 'Technology', 'Philosophy', 'Finance'];
export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const handleGoalToggle = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit and navigate to home
      navigate('/home');
    }
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <AppBar title={`Step ${step} of 3`} showBack={step > 1} backTo="#" rightAction={<button className="text-sm text-primary" onClick={() => navigate('/home')}>
            Skip
          </button>} />
      <div className="flex-1 p-6">
        {step === 1 && <>
            <h2 className="text-2xl font-bold mb-6">
              What are your primary goals?
            </h2>
            <p className="text-text-secondary mb-6">
              Select all that apply. This will help us personalize your reading
              experience.
            </p>
            <div className="flex flex-wrap">
              {goals.map(goal => <Chip key={goal.id} label={goal.label} icon={goal.icon} active={selectedGoals.includes(goal.id)} onClick={() => handleGoalToggle(goal.id)} />)}
            </div>
          </>}
        {step === 2 && <>
            <h2 className="text-2xl font-bold mb-6">
              What genres do you prefer?
            </h2>
            <p className="text-text-secondary mb-6">
              Select your favorite genre for personalized recommendations.
            </p>
            <div className="flex flex-wrap">
              {genres.map(genre => <Chip key={genre} label={genre} active={selectedGenre === genre} onClick={() => setSelectedGenre(genre)} />)}
            </div>
          </>}
        {step === 3 && <>
            <h2 className="text-2xl font-bold mb-6">
              How much time can you dedicate to reading?
            </h2>
            <p className="text-text-secondary mb-6">
              This helps us set realistic goals for your growth plan.
            </p>
            <div className="space-y-4">
              {['5-10 minutes daily', '15-30 minutes daily', '30+ minutes daily', 'Weekends only'].map(timeOption => <button key={timeOption} className="w-full p-4 border rounded-lg text-left hover:bg-gray-100">
                  {timeOption}
                </button>)}
            </div>
          </>}
      </div>
      <div className="p-6 border-t">
        <button className="w-full bg-primary text-white py-3 rounded-lg font-medium" onClick={handleContinue}>
          {step < 3 ? 'Continue' : 'Create My Growth Plan'}
        </button>
      </div>
    </div>;
};