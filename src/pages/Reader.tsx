import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { books } from '../utils/mockData';
import { CheckCircleIcon, XIcon } from 'lucide-react';
export const Reader: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const book = books.find(b => b.id === id);
  if (!book) {
    return <div>Book not found</div>;
  }
  return <div className="min-h-screen bg-surface">
      <AppBar title={book.title} showBack={true} backTo={`/book/${id}`} rightAction={<button>
            <XIcon size={20} />
          </button>} />
      <div className="p-5 mobile-scrollbar overflow-y-auto pb-20">
        <article className="prose prose-sm max-w-none font-serif">
          <h1>{book.title} - 15-Minute Summary</h1>
          <p className="text-text-secondary">By {book.author}</p>
          <h2>Key Insights</h2>
          {book.id === '1' && <>
              <p>
                In "Atomic Habits," James Clear presents a comprehensive
                framework for improving your habits and getting 1% better every
                day. The core idea is that small, consistent changes lead to
                remarkable results over time.
              </p>
              <h3>1. The Power of Compound Growth</h3>
              <p>
                Clear explains that habits are the compound interest of
                self-improvement. The effects of your habits multiply as you
                repeat them. If you get 1% better each day for one year, you'll
                end up 37 times better by the end. Conversely, if you get 1%
                worse, you'll decline nearly to zero.
              </p>
              <h3>2. Systems Over Goals</h3>
              <p>
                The book emphasizes focusing on systems rather than goals. Goals
                are about the results you want to achieve, while systems are
                about the processes that lead to those results. Clear argues
                that you do not rise to the level of your goals; you fall to the
                level of your systems.
              </p>
              <h3>3. Identity-Based Habits</h3>
              <p>
                The most effective way to change your habits is to focus on who
                you want to become, not what you want to achieve. The book
                outlines three layers of behavior change:
              </p>
              <ul>
                <li>Outcomes: What you get (results)</li>
                <li>Processes: What you do (habits)</li>
                <li>Identity: What you believe (self-image)</li>
              </ul>
              <p>
                Clear suggests that the most sustainable behavior changes come
                from identity changes. Instead of saying, "I want to quit
                smoking," say, "I am not a smoker."
              </p>
              <h3>4. The Four Laws of Behavior Change</h3>
              <p>
                The book presents a simple framework for designing good habits
                and breaking bad ones:
              </p>
              <ol>
                <li>
                  <strong>Make it obvious</strong> (or invisible for bad habits)
                </li>
                <li>
                  <strong>Make it attractive</strong> (or unattractive)
                </li>
                <li>
                  <strong>Make it easy</strong> (or difficult)
                </li>
                <li>
                  <strong>Make it satisfying</strong> (or unsatisfying)
                </li>
              </ol>
              <h3>5. Environment Design</h3>
              <p>
                Your environment has a powerful influence on your behavior. By
                designing your environment to make good habits obvious and bad
                habits invisible, you can significantly increase your chances of
                success.
              </p>
              <h2>Practical Applications</h2>
              <p>
                The book offers numerous practical strategies for implementing
                the four laws of behavior change:
              </p>
              <ul>
                <li>
                  <strong>Habit stacking:</strong> Link a new habit to an
                  existing one.
                </li>
                <li>
                  <strong>Implementation intentions:</strong> "I will [behavior]
                  at [time] in [location]."
                </li>
                <li>
                  <strong>Temptation bundling:</strong> Pair an action you want
                  to do with an action you need to do.
                </li>
                <li>
                  <strong>The two-minute rule:</strong> Scale down habits to
                  tasks that take two minutes or less.
                </li>
                <li>
                  <strong>Habit tracking:</strong> Use a visual measurement to
                  maintain your habit streak.
                </li>
              </ul>
              <h2>Conclusion</h2>
              <p>
                "Atomic Habits" provides a clear roadmap for making positive
                changes in your life through the power of tiny, consistent
                improvements. By focusing on systems instead of goals, making
                small changes to your identity, and applying the four laws of
                behavior change, you can transform your habits and achieve
                remarkable results over time.
              </p>
            </>}
          {book.id !== '1' && <>
              <p>
                In "{book.title}," {book.author} explores key concepts related
                to {book.genres.join(' and ')}. The book provides valuable
                insights into how these principles can be applied to everyday
                life.
              </p>
              <h3>Key Concept 1</h3>
              <p>
                The author presents a framework for understanding how{' '}
                {book.genres[0]} principles can lead to better outcomes in both
                personal and professional contexts.
              </p>
              <h3>Key Concept 2</h3>
              <p>
                Through extensive research and case studies, the book
                demonstrates how small changes in approach can yield significant
                improvements over time.
              </p>
              <h3>Key Concept 3</h3>
              <p>
                The interconnection between mindset and action is explored in
                depth, offering readers practical tools for implementation.
              </p>
              <h2>Practical Applications</h2>
              <p>
                The book offers several actionable strategies that readers can
                apply immediately:
              </p>
              <ul>
                <li>Strategy 1: A step-by-step approach to implementation</li>
                <li>Strategy 2: How to overcome common obstacles</li>
                <li>Strategy 3: Methods for measuring progress</li>
              </ul>
              <h2>Conclusion</h2>
              <p>
                "{book.title}" provides valuable insights that can help readers
                transform their approach to {book.genres.join(' and ')}. By
                applying the principles outlined in this summary, you can begin
                to see meaningful improvements in related areas of your life.
              </p>
            </>}
        </article>
      </div>
      <div className="fixed bottom-4 right-4">
        <Link to={`/quiz/${id}`} className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-full shadow-lg">
          <CheckCircleIcon size={24} />
        </Link>
      </div>
    </div>;
};