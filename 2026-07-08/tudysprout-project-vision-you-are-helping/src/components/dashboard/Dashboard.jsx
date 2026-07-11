import { Clock3, ShieldCheck, Sprout } from "lucide-react";
import bambooLeaves from "../../assets/illustrations/bamboo-leaves.webp";
import cozyAnimalFriend from "../../assets/illustrations/cozy-animal-friend.webp";
import lotusFlowers from "../../assets/illustrations/lotus-flowers.webp";
import { GardenScene } from "../GardenScene.jsx";
import { StatCard } from "../StatCard.jsx";
import { DashboardTasks } from "./DashboardTasks.jsx";
import { GardenSnapshot } from "./GardenSnapshot.jsx";
import { GreetingHeader } from "./GreetingHeader.jsx";
import { MossyCard } from "./MossyCard.jsx";
import { QuickActions } from "./QuickActions.jsx";
import { TodayFocus } from "./TodayFocus.jsx";
import { UpcomingDeadlines } from "./UpcomingDeadlines.jsx";
import chibiGardenLine from "../../assets/illustrations/chibi-garden-line.png";

// Dashboard is the polished homepage view. It receives data from App, then
// arranges smaller cards so each question has a clear place on the page.
export function Dashboard({
  currentGardenStage,
  gardenCoins,
  nextGardenStage,
  assignments,
  completedCount,
  completedTaskIds,
  highestRiskAssignment,
  onNavigate,
  onSelectAssignment,
  onStartFocus,
  onToggleTask,
  todayCompletedCount,
  todayPlan,
  todayTaskCount,
  totalMinutes,
  totalTaskCount,
}) {
  return (
    <section className="dashboard-home" aria-label="Dashboard">
      <div className="dashboard-main-column">
        <GreetingHeader
          highestRiskAssignment={highestRiskAssignment}
          todayCompletedCount={todayCompletedCount}
          todayTaskCount={todayTaskCount}
          totalMinutes={totalMinutes}
        />

        <div className="stat-card-grid" aria-label="Daily stats">
          <StatCard
            accent="sage"
            decorationSrc={bambooLeaves}
            icon={Sprout}
            label="Tasks Done"
            note="One leaf at a time"
            value={`${todayCompletedCount}/${todayTaskCount}`}
          />
          <StatCard
            accent="blush"
            decorationSrc={lotusFlowers}
            icon={Clock3}
            label="Focus Time"
            note="Gentle study minutes"
            value={`${totalMinutes} min`}
          />
          <StatCard
            accent="gold"
            decorationSrc={cozyAnimalFriend}
            icon={ShieldCheck}
            label="Forecast"
            note={highestRiskAssignment?.course ?? "All calm"}
            value={highestRiskAssignment?.risk.label ?? "Low Risk"}
          />
        </div>

        <QuickActions onNavigate={onNavigate} />

        <TodayFocus
          assignment={highestRiskAssignment}
          completedTaskIds={completedTaskIds}
          onSelectAssignment={onSelectAssignment}
          onStartFocus={onStartFocus}
          todayPlan={todayPlan}
        />

        <UpcomingDeadlines
          assignments={assignments}
          completedTaskIds={completedTaskIds}
          onSelectAssignment={onSelectAssignment}
        />

      </div>

      <aside className="dashboard-garden-column" aria-label="Garden sidebar">
        <GardenScene completedCount={completedCount} totalTasks={totalTaskCount} />

        <GardenSnapshot
          coins={gardenCoins}
          completedCount={completedCount}
          currentStage={currentGardenStage}
          nextStage={nextGardenStage}
          totalTaskCount={totalTaskCount}
        />
        <DashboardTasks
          completedTaskIds={completedTaskIds}
          onStartFocus={onStartFocus}
          onToggleTask={onToggleTask}
          tasks={todayPlan}
          todayCompletedCount={todayCompletedCount}
          totalMinutes={totalMinutes}
        />
      </aside>

    </section>
  );
}
