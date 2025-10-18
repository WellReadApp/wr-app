// Mock data for the app
export const books = [{
  id: '1',
  title: 'Atomic Habits',
  author: 'James Clear',
  cover: 'https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg',
  genres: ['Self-Help', 'Productivity'],
  summary: 'Tiny Changes, Remarkable Results. No matter your goals, Atomic Habits offers a proven framework for improving every day.',
  quotes: [{
    quote: 'Habits are the compound interest of self-improvement.',
    attribution: 'James Clear, Atomic Habits'
  }, {
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    attribution: 'James Clear, Atomic Habits'
  }],
  rating: 4.8
}, {
  id: '2',
  title: 'Deep Work',
  author: 'Cal Newport',
  cover: 'https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg',
  genres: ['Productivity', 'Business'],
  summary: 'Rules for Focused Success in a Distracted World. Deep work is the ability to focus without distraction on a cognitively demanding task.',
  quotes: [{
    quote: "If you don't produce, you won't thrive—no matter how skilled or talented you are.",
    attribution: 'Cal Newport, Deep Work'
  }],
  rating: 4.5
}, {
  id: '3',
  title: 'Think Again',
  author: 'Adam Grant',
  cover: 'https://images-na.ssl-images-amazon.com/images/I/71z7lF2wBHS.jpg',
  genres: ['Psychology', 'Leadership'],
  summary: "The Power of Knowing What You Don't Know. Intelligence is usually seen as the ability to think and learn, but in a rapidly changing world, there's another set of cognitive skills that might matter more: the ability to rethink and unlearn.",
  quotes: [{
    quote: 'We laugh at people who still use Windows 95, yet we still cling to opinions that we formed in 1995.',
    attribution: 'Adam Grant, Think Again'
  }],
  rating: 4.6
}, {
  id: '4',
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  cover: 'https://images-na.ssl-images-amazon.com/images/I/71TRB2X0hvL.jpg',
  genres: ['Finance', 'Psychology'],
  summary: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave.",
  quotes: [{
    quote: "Wealth is what you don't see. It's the cars not purchased. The diamonds not bought. The renovations postponed, the clothes forgone and the first-class upgrade declined.",
    attribution: 'Morgan Housel, The Psychology of Money'
  }],
  rating: 4.7
}];
export const growthPlan = [{
  id: '1',
  progress: 75
}, {
  id: '3',
  progress: 0
}, {
  id: '2',
  progress: 0
}];
export const quizzes = {
  '1': [{
    question: 'According to James Clear, what is the key to behavior change?',
    options: ['Setting ambitious goals', 'Focusing on systems instead of goals', 'Public accountability', 'Willpower and motivation'],
    correctAnswer: 1
  }, {
    question: 'What does the author suggest is the best way to build a new habit?',
    options: ['Start with a 30-day challenge', 'Make it obvious, attractive, easy, and satisfying', 'Use the 21-day rule', 'Focus on the end result'],
    correctAnswer: 1
  }, {
    question: 'What is habit stacking?',
    options: ['Doing multiple habits at once', 'Building a routine of habits', 'Linking a new habit to an existing one', 'Tracking habits on a calendar'],
    correctAnswer: 2
  }]
};
export const userProfile = {
  name: 'Jane Doe',
  streak: 12,
  points: 450,
  booksRead: 8,
  readingList: ['2', '4']
};