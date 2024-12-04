const randomDailyNotification = () => {
    const randomIndex = Math.floor(Math.random() * 10); // Adjusted for 10 daily reminders
    const dailyReminders = [
      {
        title: 'Start Your Day with Learning! ☀️',
        subtitle: "A great day begins with knowledge!",
        body: "Kickstart your day with a quick learning session. Discover something new today! 🚀",
      },
      {
        title: 'Small Steps, Big Gains! 📈',
        subtitle: 'Every little bit counts!',
        body: "Consistency is key. A short learning session today will take you one step closer to mastery!",
      },
      {
        title: 'Your Daily Dose of Knowledge 💡',
        subtitle: "Fuel your curiosity!",
        body: "Just a few minutes of learning can make a huge difference. Let's dive in!",
      },
      {
        title: 'Embrace the Journey! 🎒',
        subtitle: "Keep up the great work!",
        body: "You're on a path to greatness. Keep learning and growing, one step at a time!",
      },
      {
        title: 'Stay Curious! 🧠',
        subtitle: "Curiosity fuels success.",
        body: "Take a few minutes to learn something new today. Keep that curiosity alive!",
      },
      {
        title: 'Progress Over Perfection! 🌱',
        subtitle: 'Every session counts.',
        body: "You don't have to learn everything at once. Keep going, one lesson at a time!",
      },
      {
        title: 'Another Day, Another Lesson! 📚',
        subtitle: "Learning never stops.",
        body: "Today’s a new opportunity to learn and grow. Let’s make the most of it!",
      },
      {
        title: 'Fuel Your Passion! 🔥',
        subtitle: "Passion drives progress.",
        body: "Keep that passion alive by diving into something new today!",
      },
      {
        title: 'Build Your Knowledge! 🛠️',
        subtitle: "Construct your future.",
        body: "Each learning session builds the foundation for your future success. Keep at it!",
      },
      {
        title: 'Consistency is Key! 🔑',
        subtitle: "Keep going!",
        body: "Small, consistent learning moments lead to big achievements. Stay on track!",
      },
    ];
  
    const selectedReminder = dailyReminders[randomIndex];
    return selectedReminder;
  }
  
  export default randomDailyNotification;
  