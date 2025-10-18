import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { ProgressBar } from '../components/ProgressBar';
import { books, quizzes } from '../utils/mockData';
import { CheckIcon, XIcon } from 'lucide-react';
export const Quiz: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const book = books.find(b => b.id === id);
  const quiz = id ? quizzes[id as keyof typeof quizzes] : null;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  if (!book || !quiz) {
    return <div>Quiz not found</div>;
  }
  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };
  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };
  const handleFinish = () => {
    navigate('/home');
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <AppBar title={`Quiz: ${book.title}`} showBack={true} backTo={`/book/${id}`} />
      {!quizCompleted ? <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>
                Question {currentQuestion + 1} of {quiz.length}
              </span>
              <span>Score: {score}</span>
            </div>
            <ProgressBar progress={(currentQuestion + 1) / quiz.length * 100} />
          </div>
          <h2 className="text-xl font-semibold mb-6">
            {quiz[currentQuestion].question}
          </h2>
          <div className="space-y-3 mb-8">
            {quiz[currentQuestion].options.map((option, index) => <button key={index} className={`w-full p-4 border rounded-lg text-left flex justify-between items-center ${selectedAnswer === index ? index === quiz[currentQuestion].correctAnswer ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500' : isAnswered && index === quiz[currentQuestion].correctAnswer ? 'bg-green-100 border-green-500' : ''}`} onClick={() => handleAnswerSelect(index)} disabled={isAnswered}>
                <span>{option}</span>
                {isAnswered && (index === quiz[currentQuestion].correctAnswer ? <CheckIcon size={18} className="text-green-500" /> : selectedAnswer === index ? <XIcon size={18} className="text-red-500" /> : null)}
              </button>)}
          </div>
          {isAnswered && <button className="w-full bg-primary text-white py-3 rounded-lg font-medium" onClick={handleNext}>
              {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
            </button>}
        </div> : <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-primary text-4xl font-bold">{score}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-text-secondary mb-8 text-center">
            You scored {score} out of {quiz.length} questions correctly.
          </p>
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Your score</span>
              <span>{Math.round(score / quiz.length * 100)}%</span>
            </div>
            <ProgressBar progress={score / quiz.length * 100} />
          </div>
          <div className="mt-12 w-full">
            <button className="w-full bg-primary text-white py-3 rounded-lg font-medium mb-3" onClick={handleFinish}>
              Back to Home
            </button>
            <button className="w-full border border-primary text-primary py-3 rounded-lg font-medium" onClick={() => {
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setIsAnswered(false);
          setScore(0);
          setQuizCompleted(false);
        }}>
              Retry Quiz
            </button>
          </div>
        </div>}
    </div>;
};