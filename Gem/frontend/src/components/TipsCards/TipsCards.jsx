import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const quotes = [
  "Practice mindfulness daily for inner peace and clarity.🔆",
  "Connect with loved ones for support and companionship.🍀",
  "Engage in regular physical activity for mental well-being.🏃‍♂️",
  "Prioritize sufficient sleep for cognitive function and emotional balance.✨💚",
  "Limit screen time to reduce stress and improve sleep quality.💤",
  "Take time for self-care to recharge and rejuvenate.🌸",
  "Focus on what you can control, and let go of what you can't.💭",
  "Embrace your emotions, but don’t let them define you.💙",
  "Reach out for help when you feel overwhelmed.🤝",
  "Spend time in nature to calm your mind and lift your mood.🌳",
  "Laugh often—it’s a natural stress reliever.😂",
  "Accept yourself as you are, imperfections and all.💫",
  "Challenge negative thoughts and replace them with positive ones.🌻",
  "Write down your feelings to gain clarity and reduce anxiety.📝",
  "Surround yourself with positivity and encouragement.🌟",
  "Take deep breaths when stress arises to center yourself.🌬️",
  "Break tasks into smaller steps to make them more manageable.🔖",
  "Remember to celebrate small victories in your journey.🎉",
  "Stay hydrated—your brain needs water to function optimally.💧",
  "Engage in creative activities to express yourself freely.🎨",
  "Forgive yourself for past mistakes, and focus on the present.🌿",
  "Set realistic goals that align with your values and priorities.🎯",
  "Limit caffeine intake to improve your mood and reduce anxiety.☕",
  "Focus on progress, not perfection.🚀",
  "Listen to calming music to reduce stress and promote relaxation.🎶",
  "Practice gratitude daily to improve your mental outlook.🙏",
  "Stay organized to reduce feelings of being overwhelmed.📅",
  "Be kind to yourself, especially when you're struggling.💗",
  "Get outside for fresh air when you feel mentally drained.🍂",
  "Set healthy boundaries to protect your energy.🚧",
  "Make time for hobbies that bring you joy and relaxation.🎳",
  "Accept that it’s okay to say no to things that drain you.🛑",
  "Start each day with a positive affirmation.📜",
  "Limit multitasking to improve focus and reduce stress.📋",
  "Visualize a peaceful place to calm your mind in stressful situations.🌅",
  "Find humor in everyday life, even in difficult times.😂",
  "Disconnect from social media to reduce comparison and anxiety.📵",
  "Keep a journal to track your mood and reflect on growth.📖",
  "Learn to forgive others to lighten emotional burdens.🤍",
  "Eat nutritious foods to support your mental and physical health.🥗",
  "Take breaks throughout the day to avoid burnout.⏸️",
  "Practice yoga or stretching to relieve tension in the body.🧘‍♀️",
  "Talk about your feelings with someone you trust.💬",
  "Spend time with pets to feel more relaxed and joyful.🐾",
  "Engage in acts of kindness to boost your own mood.💝",
  "Take time to meditate and quiet your mind.🧘",
  "Set aside 'me time' each day to do something you enjoy.⏳",
  "Give yourself permission to rest when you're tired.😌",
  "Avoid self-criticism by treating yourself with compassion.💖",
  "Recognize the signs of burnout and take proactive steps to recharge.⚡",
  "Focus on solutions, not problems, when faced with challenges.🔍",
  "Take a digital detox to reduce screen-induced stress.",
  "Focus on self-growth rather than comparing yourself to others.🌱",
  "Create a morning routine that sets a positive tone for the day.⏰",
  "Practice self-compassion, especially during tough times.💞",
  "Find balance between work and relaxation for mental clarity.⚖️",
  "Engage in activities that stimulate your mind and creativity.💡",
  "Take small steps each day to build resilience and strength.🏔️",
  "Cherish the moments of joy and hold onto them.🎈",
  "Accept that not every day will be perfect, and that's okay.🌥️",
  "Develop a positive mindset by focusing on your strengths.💪",
  "Don't hesitate to seek professional help when you need it.👩‍⚕️",
  "Remember, your mental health is as important as your physical health.🏥",
  "Learn to recognize and manage stress triggers.⚡",
  "Practice grounding techniques when you feel overwhelmed.🌍",
  "Take things one day at a time, especially during tough periods.🗓️",
  "Cultivate patience with yourself and others.⏳",
  "Find beauty in the little things and moments in life.🌼",
  "Take responsibility for your mental well-being by practicing self-care.🧡",
  "Surround yourself with people who inspire and uplift you.💬",
  "Make time to decompress after a long day.💆‍♂️",
  "Believe in your ability to overcome obstacles.🌈",
  "Find a relaxation technique that works for you, whether it's meditation or deep breathing.🧘‍♂️",
  "Invest time in understanding your emotions and needs.🧠",
  "Celebrate the uniqueness that makes you who you are.🎨",
  "Maintain a sense of humor in the face of adversity.😄",
  "Accept that personal growth takes time and effort.⏲️",
  "Set healthy limits on obligations to protect your mental health.🛑",
  "Honor your feelings and allow yourself to experience them.💭",
  "Understand that asking for help is a sign of strength, not weakness.🏋️‍♀️",
  "Be mindful of your inner dialogue—choose kindness.🗣️",
  "Prioritize activities that recharge your mental and emotional energy.⚡",
  "Engage in positive self-talk to boost confidence and resilience.💬",
  "Get plenty of sunlight to improve your mood and energy.☀️",
  "Practice acceptance of things you cannot change.🌱",
  "Find joy in simple pleasures, like a walk in the park or a cup of tea.🍵",
  "Surround yourself with uplifting environments and people.🌺",
  "Take regular mental health days to reset and recharge.⛱️",
  "Be patient with yourself as you navigate your mental health journey.🐢",
  "Reward yourself for progress, no matter how small.🏅",
  "Recognize your triggers and practice strategies to manage them.🧩",
  "Embrace the power of positive habits to maintain well-being.🏗️",
  "Focus on living authentically rather than pleasing others.💡",
  "Keep learning and growing to nurture a resilient mind.📚",
  "Avoid overcommitting yourself and prioritize rest.🛏️",
  "Remind yourself that you are worthy of love and care.💌",
  "Stay mindful of your emotional needs and honor them.💙",
  "Stay curious about your mental health and explore new coping strategies.🧩",
  "Release perfectionism and embrace progress over perfection.🌸",
  "Express gratitude daily to shift your mindset toward positivity.🌞",
  "Set intentions each day to guide your mental and emotional energy.🌟",
  "Find value in solitude and take time to be with yourself.🏞️",
  "Speak kindly to yourself, especially in moments of self-doubt.💬",
  "Practice letting go of things that are beyond your control.🌬️",
  "Take time to laugh and enjoy the present moment.🎉",
  "Build mental resilience through small daily habits.🏋️",
  "Acknowledge that your mental health matters, and it’s okay to prioritize it.🛠️"
];


const TipsCards = () => {
  const [open, setOpen] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => Math.floor(Math.random() * 81));

  const handleClose = () => {
    setOpen(false);
  };

  const handleExited = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    setOpen(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={null} // null to keep open until user clicks close
      onClose={handleClose}
      onExited={handleExited}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      style={{ position: "fixed", bottom: "24px", right: "0" }}
    >
      <SnackbarContent
        style={{
          border: "0px solid #4FC3F7",
          backgroundColor: "#fff",
          color: "#000",
          maxWidth: "400px",
        }}
        message={
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "auto",fontWeight: "450", letterSpacing: "1px" }}>
              {quotes[currentQuoteIndex]}
            </span>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
              style={{ marginLeft: "0px", color: "black",  }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        }
      />
    </Snackbar>
  );
};

export default TipsCards;
