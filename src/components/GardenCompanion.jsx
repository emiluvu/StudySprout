import { Heart } from "lucide-react";
import { MossyAvatar } from "./MossyAvatar.jsx";
import {
  getGardenRewards,
  getLatestUnlockedReward,
} from "../utils/rewards.js";

// GardenCompanion shows the friendly avatar and a short encouragement message.
// It uses progress, risk, and garden rewards to choose a supportive coach note.
export function GardenCompanion({
  completedCount,
  highestRisk,
  todayCompletedCount,
  todayTaskCount,
}) {
  const unlockedRewards = getGardenRewards(completedCount).filter(
    (reward) => reward.unlocked,
  );
  const latestReward = getLatestUnlockedReward(completedCount);
  const coach = chooseMossyCoachMessage({
    completedCount,
    highestRisk,
    latestReward,
    todayCompletedCount,
    todayTaskCount,
    unlockedRewardCount: unlockedRewards.length,
  });

  return (
    <aside className="companion-card" aria-label="Garden companion">
      <MossyAvatar size="small" />
      <div>
        <p className="companion-name">
          <Heart size={16} />
          <span>Mossy</span>
          <span className={`companion-status ${coach.mood.toLowerCase()}`}>
            {coach.mood}
          </span>
        </p>
        <p className="companion-message">{coach.message}</p>
      </div>
    </aside>
  );
}

// These message rules are ordered from most specific to most general. That
// makes Mossy predictable: urgent support wins before general celebration.
const mossyMessageRules = [
  {
    mood: "Encouraging",
    message: "No rush. Choose one tiny first step and I will keep you company.",
    shouldUse: ({ completedCount }) => completedCount === 0,
  },
  {
    mood: "Concerned",
    message:
      "A high-risk assignment needs a gentle nudge. One small step can lower the pressure.",
    shouldUse: ({ highestRisk, todayCompletedCount }) =>
      highestRisk?.tone === "high" && todayCompletedCount === 0,
  },
  {
    mood: "Proud",
    message:
      "You started even with a high-risk assignment nearby. That is real momentum.",
    shouldUse: ({ highestRisk, todayCompletedCount }) =>
      highestRisk?.tone === "high" && todayCompletedCount > 0,
  },
  {
    mood: "Proud",
    message: "Today's plan is complete. Your garden can feel that steady care.",
    shouldUse: ({ todayCompletedCount, todayTaskCount }) =>
      todayTaskCount > 0 && todayCompletedCount === todayTaskCount,
  },
  {
    mood: "Excited",
    message:
      "Your reward garden is filling in beautifully. Every unlocked corner tells a story.",
    shouldUse: ({ unlockedRewardCount }) => unlockedRewardCount >= 4,
  },
  {
    mood: "Excited",
    message: ({ latestReward }) =>
      `${latestReward.label} is unlocked. Tiny steps are turning into a real garden.`,
    shouldUse: ({ latestReward }) => Boolean(latestReward),
  },
  {
    mood: "Proud",
    message: "Strong progress today. Your focus is adding up in a very visible way.",
    shouldUse: ({ todayCompletedCount }) => todayCompletedCount >= 2,
  },
  {
    mood: "Encouraging",
    message:
      "There is a medium-risk assignment on the path, but the next step is still small.",
    shouldUse: ({ highestRisk }) => highestRisk?.tone === "medium",
  },
  {
    mood: "Calm",
    message: "Your forecast looks calm. A steady pace will keep the garden growing.",
    shouldUse: ({ highestRisk }) => highestRisk?.tone === "low",
  },
  {
    mood: "Encouraging",
    message: "Tiny progress still counts. I am right here for the next step.",
    shouldUse: () => true,
  },
];

function chooseMossyCoachMessage(context) {
  const matchingRule = mossyMessageRules.find((rule) => rule.shouldUse(context));
  const message =
    typeof matchingRule.message === "function"
      ? matchingRule.message(context)
      : matchingRule.message;

  return {
    mood: matchingRule.mood,
    message,
  };
}
