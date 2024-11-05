const randomReminder = (courseTitle: string) => {
  const randomIndex = Math.floor(Math.random() * 10) // Adjusted to 10 for the number of reminders
  const reminders = [
    {
      title: 'Time to Level Up! 🚀',
      subtitle: "Don't let your progress cool off! 🧠",
      body: `Continue your ${courseTitle} course today to unlock new skills. You're just a few clicks away from your next milestone! 🔥`,
    },
    {
      title: 'Your Learning Journey Awaits! 🎓',
      subtitle: 'Ready to dive back in? 🌊',
      body: `Simesta AI has fresh insights waiting for you in your ${courseTitle} course. Keep building those skills and reach new heights! 🌟`,
    },
    {
      title: 'Did You Know? 🤓',
      subtitle: 'Fun Fact for the Curious Mind 🧩',
      body: `Learning for just 10 minutes can boost focus! Jump back into your ${courseTitle} course and see what Simesta AI has for you! 📖`,
    },
    {
      title: 'Keep the Momentum Going! 🏃‍♀️',
      subtitle: 'Small steps make a big impact 💪',
      body: `Your ${courseTitle} course awaits. Continue today and celebrate each step forward! 🎉`,
    },
    {
      title: 'Unlock New Knowledge! 🔓',
      subtitle: 'Just one lesson away from a breakthrough 💡',
      body: `Don't miss out on today’s insights in your ${courseTitle} course. Open Simesta AI and dive back in! 🌐`,
    },
    {
      title: 'Learning Just Got Fun! 🎉',
      subtitle: 'See what Simesta has in store for you 🎈',
      body: `Get ready for an exciting new lesson in your ${courseTitle} course. Keep up the pace and learn something amazing today! 🌟`,
    },
    {
      title: 'Almost There! 🎯',
      subtitle: 'Just a few lessons left 📚',
      body: `You're so close to completing your ${courseTitle} course! Finish strong and open Simesta AI to complete it. 🏆`,
    },
    {
      title: "It's Learning Time! 🕒",
      subtitle: 'Your next lesson awaits 🏅',
      body: `Ready to boost your skills? Open Simesta AI and make today a success in your ${courseTitle} course! 🎓`,
    },
    {
      title: 'Stay Curious! 🧠',
      subtitle: 'Another day, another lesson 📖',
      body: `There’s something new to discover in your ${courseTitle} course. Jump back in with Simesta AI! 🔍`,
    },
    {
      title: 'Simesta AI Tip of the Day 🌞',
      subtitle: 'A little tip for big progress 💡',
      body: `Did you know regular review improves retention? Make today’s session in your ${courseTitle} course count! 📘`,
    },
  ]

  const selectedReminder = reminders[randomIndex]
  console.log(selectedReminder)
  return selectedReminder
}

export default randomReminder
