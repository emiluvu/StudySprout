import cherryBlossomGrove from "../assets/garden-stages/cherry-blossom-grove.png";
import gentlePond from "../assets/garden-stages/gentle-pond.png";
import lotusGarden from "../assets/garden-stages/lotus-garden.png";
import mossyClearing from "../assets/garden-stages/mossy-clearing.png";
import stoneBridge from "../assets/garden-stages/stone-bridge.png";
import stoneGarden from "../assets/garden-stages/stone-garden.png";
import studySanctuary from "../assets/garden-stages/study-sanctuary.png";
import teaGarden from "../assets/garden-stages/tea-garden.png";
import tinySprout from "../assets/garden-stages/tiny-sprout.png";
import wildflowers from "../assets/garden-stages/wildflowers.png";

// The garden game uses one simple currency: coins.
// App adds or removes this amount when a task checkbox changes.
export const COINS_PER_TASK = 10;

// Each stage is a default garden level. Students do not place custom items yet;
// they spend coins to move from one illustrated garden stage to the next.
export const gardenStages = [
  {
    id: "stage-1",
    level: 0,
    stageLabel: "Stage 1",
    name: "Tiny Sprout",
    description: "A single sprout emerges, full of potential.",
    upgradeCost: 0,
    imageSrc: tinySprout,
  },
  {
    id: "stage-2",
    level: 1,
    stageLabel: "Stage 2",
    name: "Mossy Clearing",
    description: "Soft moss spreads, bringing life to the earth.",
    upgradeCost: 150,
    imageSrc: mossyClearing,
  },
  {
    id: "stage-3",
    level: 2,
    stageLabel: "Stage 3",
    name: "Wildflowers",
    description: "Wildflowers bloom, adding color and joy.",
    upgradeCost: 250,
    imageSrc: wildflowers,
  },
  {
    id: "stage-4",
    level: 3,
    stageLabel: "Stage 4",
    name: "Stone Garden",
    description: "Stepping stones appear, creating a peaceful path.",
    upgradeCost: 350,
    imageSrc: stoneGarden,
  },
  {
    id: "stage-5",
    level: 4,
    stageLabel: "Stage 5",
    name: "Gentle Pond",
    description: "A small pond reflects the sky's calm.",
    upgradeCost: 450,
    imageSrc: gentlePond,
  },
  {
    id: "stage-6",
    level: 5,
    stageLabel: "Stage 6",
    name: "Lotus Garden",
    description: "Lotus flowers bloom, bringing beauty and peace.",
    upgradeCost: 600,
    imageSrc: lotusGarden,
  },
  {
    id: "stage-7",
    level: 6,
    stageLabel: "Stage 7",
    name: "Cherry Blossom Grove",
    description: "A cherry tree blossoms, its petals dance on the breeze.",
    upgradeCost: 750,
    imageSrc: cherryBlossomGrove,
  },
  {
    id: "stage-8",
    level: 7,
    stageLabel: "Stage 8",
    name: "Stone Bridge",
    description: "A gentle bridge connects each side with harmony.",
    upgradeCost: 900,
    imageSrc: stoneBridge,
  },
  {
    id: "stage-9",
    level: 8,
    stageLabel: "Stage 9",
    name: "Tea Garden",
    description: "A quiet tea corner invites rest and reflection.",
    upgradeCost: 1100,
    imageSrc: teaGarden,
  },
  {
    id: "stage-10",
    level: 9,
    stageLabel: "Stage 10",
    name: "Study Sanctuary",
    description: "A complete sanctuary for focus, growth, and calm.",
    upgradeCost: 1300,
    imageSrc: studySanctuary,
  },
];

export function getCurrentGardenStage(stageId) {
  return gardenStages.find((stage) => stage.id === stageId) ?? gardenStages[0];
}

export function getNextGardenStage(stageId) {
  const currentStage = getCurrentGardenStage(stageId);

  return gardenStages[currentStage.level + 1] ?? null;
}

export function getMaxGardenStage() {
  return gardenStages[gardenStages.length - 1];
}

export function isMaxGardenStage(stageId) {
  return getCurrentGardenStage(stageId).id === getMaxGardenStage().id;
}

// These compatibility helpers keep older Mossy/focus code from depending on the
// removed custom-piece reward model. New UI should use gardenStages instead.
export function getGardenRewards() {
  return [];
}

export function getLatestUnlockedReward() {
  return null;
}

export function getNextGardenReward() {
  return null;
}
