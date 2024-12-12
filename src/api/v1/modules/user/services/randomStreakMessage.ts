const getRandomStreakMessage = (streakNumber: number) => {
  const streakMessages = [
    {
      title: 'Your Streak is Just Starting! 🌟',
      subtitle: "You're on a roll! 🎉",
      body: `You've hit a 1-day streak! Keep the momentum going and see how far you can go! 🔥`,
    },
    {
      title: 'Two Days Strong! 💪',
      subtitle: 'Consistency is key 🔑',
      body: `You're on a 2-day streak! Amazing effort so far—don't stop now! 🚀`,
    },
    {
      title: 'Three Days of Excellence! 🏆',
      subtitle: 'You’re building a habit! 🧠',
      body: `A 3-day streak is impressive! Stick with it and achieve greatness! 🌟`,
    },
    {
      title: 'One Week Down! 🗓️',
      subtitle: 'A week of growth 🌱',
      body: `You're on a 7-day streak! This dedication will take you far. Keep it up! 🎯`,
    },
    {
      title: 'Two Weeks of Progress! 📈',
      subtitle: 'Half a month of success 💼',
      body: `Your 14-day streak is incredible! Keep smashing those goals! 🏅`,
    },
    {
      title: 'Three Weeks of Growth! 🌱',
      subtitle: 'Keep the momentum going! 🚀',
      body: `You're on a 21-day streak! You're unstoppable! Keep up the fantastic work! 🌟`,
    },
    {
      title: 'A Whole Month! 🗓️',
      subtitle: '30 Days of Growth 🌟',
      body: `30 days of streaking! Celebrate your hard work and keep aiming higher! 🏆`,
    },
    {
      title: 'Half a Century! 🎉',
      subtitle: '50 Days of Dedication 🚀',
      body: `You've hit a 50-day streak! You're unstoppable! Keep up the amazing work! 🌟`,
    },
    {
      title: 'Streak Legend in the Making! 🔥',
      subtitle: 'Keep the fire alive! 🔥',
      body: `You're on a blazing streak of ${streakNumber} days! Keep striving for greatness! 🚀`,
    }
  ]

  let selectedMessage
  switch (streakNumber) {
    case 1:
      selectedMessage = streakMessages[0]
      break
    case 2:
      selectedMessage = streakMessages[1]
      break
    case 3:
      selectedMessage = streakMessages[2]
      break
    case 7:
      selectedMessage = streakMessages[3]
      break
    case 14:
      selectedMessage = streakMessages[4]
      break
    case 21:
      selectedMessage = streakMessages[5]
      break
    case 30:
      selectedMessage = streakMessages[6]
      break
    case 50:
      selectedMessage = streakMessages[7]
      break
    default:
      selectedMessage = streakMessages[8]
      break
  }
  return selectedMessage
}

const streakMailSubjects = [
  "You're on a Roll!",
  'Keep the Momentum Going!',
  'Amazing Progress, Keep It Up!',
  'Your Learning Journey is Inspiring!',
  "Stay on Track – You're Doing Great!",
  'Consistency is Your Superpower!',
  'Celebrate Your Dedication to Growth!',
  "You're Building Something Incredible!",
  'Every Day Counts – Keep Going!',
  'Learning Streak Champion!',
]

const generateRandomStreakmailSubject = () => {
  const randomIndex = Math.floor(Math.random() * streakMailSubjects.length)
  return streakMailSubjects[randomIndex]
}

export { getRandomStreakMessage, generateRandomStreakmailSubject }
