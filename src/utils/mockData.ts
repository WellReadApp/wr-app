export const mockBooks = [{
  id: '1',
  title: 'Atomic Habits',
  author: 'James Clear',
  cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  category: 'Self-Improvement',
  readTime: '15 min',
  listenTime: '18 min',
  progress: 65,
  description: 'An easy & proven way to build good habits & break bad ones. Discover how tiny changes can lead to remarkable results.',
  keyTakeaways: ['Small habits compound over time to create remarkable results', 'Focus on systems, not goals', 'Make it obvious, attractive, easy, and satisfying', 'Environment design is crucial for behavior change'],
  quotes: [{
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear'
  }, {
    text: 'Every action you take is a vote for the type of person you wish to become.',
    author: 'James Clear'
  }, {
    text: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
    author: 'James Clear'
  }],
  summary: {
    pages: [{
      title: 'The Fundamentals',
      content: 'Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day and yet the impact they deliver over the months and years can be enormous. It is only when looking back two, five, or perhaps ten years later that the value of good habits and the cost of bad ones becomes strikingly apparent.\n\nYour outcomes are a lagging measure of your habits. Your net worth is a lagging measure of your financial habits. Your weight is a lagging measure of your eating habits. Your knowledge is a lagging measure of your learning habits. You get what you repeat.'
    }, {
      title: 'How Habits Work',
      content: 'The process of building a habit can be divided into four simple steps: cue, craving, response, and reward. This four-step pattern is the backbone of every habit, and your brain runs through these steps in the same order each time.\n\nFirst, there is the cue. The cue triggers your brain to initiate a behavior. Second, there is the craving. Cravings are the motivational force behind every habit. Third, there is the response. The response is the actual habit you perform. Finally, there is the reward. Rewards are the end goal of every habit.'
    }, {
      title: 'The Four Laws',
      content: "The 1st Law: Make It Obvious. The two most common cues are time and location. Implementation intentions leverage both of these cues.\n\nThe 2nd Law: Make It Attractive. Temptation bundling is one way to apply a psychology theory known as Premack's Principle.\n\nThe 3rd Law: Make It Easy. The most effective form of learning is practice, not planning. Focus on taking action, not being in motion.\n\nThe 4th Law: Make It Satisfying. We are more likely to repeat a behavior when the experience is satisfying."
    }]
  },
  amazonLink: 'https://amazon.com/atomic-habits'
}, {
  id: '2',
  title: 'Deep Work',
  author: 'Cal Newport',
  cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop',
  category: 'Productivity',
  readTime: '18 min',
  listenTime: '22 min',
  progress: 0,
  description: 'Rules for focused success in a distracted world. Learn how to cultivate deep work and eliminate shallow distractions.',
  keyTakeaways: ['Deep work is becoming increasingly rare and valuable', 'Schedule every minute of your day', 'Embrace boredom to strengthen focus', 'Quit social media strategically'],
  quotes: [{
    text: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.',
    author: 'Cal Newport'
  }, {
    text: 'Clarity about what matters provides clarity about what does not.',
    author: 'Cal Newport'
  }],
  summary: {
    pages: [{
      title: 'Deep Work Defined',
      content: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time. Deep work will make you better at what you do and provide the sense of true fulfillment that comes from craftsmanship."
    }, {
      title: 'The Rules',
      content: "Work Deeply: Transform deep work from an aspiration into a regular and significant part of your daily schedule. Embrace Boredom: Don't take breaks from distraction. Instead take breaks from focus. Quit Social Media: Apply the craftsman approach to tool selection. Drain the Shallows: Schedule every minute of your day."
    }]
  },
  amazonLink: 'https://amazon.com/deep-work'
}, {
  id: '3',
  title: 'Thinking, Fast and Slow',
  author: 'Daniel Kahneman',
  cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  category: 'Psychology',
  readTime: '20 min',
  listenTime: '25 min',
  progress: 0,
  description: 'Explore the two systems that drive the way we think and make decisions.',
  keyTakeaways: ['System 1 is fast, intuitive, and emotional', 'System 2 is slower, more deliberative, and logical', 'We are prone to cognitive biases', 'Understanding these systems improves decision-making'],
  quotes: [{
    text: 'Nothing in life is as important as you think it is while you are thinking about it.',
    author: 'Daniel Kahneman'
  }],
  summary: {
    pages: [{
      title: 'Two Systems',
      content: 'System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental activities that demand it, including complex computations.'
    }]
  },
  amazonLink: 'https://amazon.com/thinking-fast-slow'
}];
export const categories = ['Self-Improvement', 'Productivity', 'Psychology', 'Business', 'Health', 'Leadership', 'Creativity', 'Finance'];
export const growthPlan = {
  currentMilestone: 'Foundation Builder',
  progress: 45,
  totalBooks: 12,
  completedBooks: 5,
  milestones: [{
    id: 1,
    name: 'Foundation Builder',
    description: 'Build your personal growth foundation',
    books: ['Atomic Habits', 'Deep Work', 'The Power of Now'],
    progress: 66,
    completed: 2,
    total: 3
  }, {
    id: 2,
    name: 'Mindset Master',
    description: 'Develop a growth mindset',
    books: ['Mindset', 'Grit', 'The Obstacle is the Way'],
    progress: 33,
    completed: 1,
    total: 3
  }, {
    id: 3,
    name: 'Productivity Pro',
    description: 'Master time management and focus',
    books: ['Essentialism', 'The One Thing', 'Make Time'],
    progress: 0,
    completed: 0,
    total: 3
  }]
};
export const userStats = {
  streak: 12,
  totalMinutes: 1240,
  booksCompleted: 5,
  bonusPoints: 850,
  nextMilestone: 'Knowledge Seeker',
  pointsToNext: 150,
  badges: [{
    id: 1,
    name: 'Week Warrior',
    icon: '🔥',
    earned: true
  }, {
    id: 2,
    name: 'Speed Reader',
    icon: '⚡',
    earned: true
  }, {
    id: 3,
    name: 'Early Bird',
    icon: '🌅',
    earned: true
  }, {
    id: 4,
    name: 'Night Owl',
    icon: '🦉',
    earned: false
  }, {
    id: 5,
    name: 'Consistency King',
    icon: '👑',
    earned: false
  }]
};