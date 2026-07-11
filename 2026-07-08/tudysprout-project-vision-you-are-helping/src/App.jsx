import { useEffect, useMemo, useState } from "react";
import { AddAssignmentForm } from "./components/AddAssignmentForm.jsx";
import { AppSidebar } from "./components/AppSidebar.jsx";
import { AssignmentDetails } from "./components/AssignmentDetails.jsx";
import { Dashboard } from "./components/dashboard/Dashboard.jsx";
import { FocusMode } from "./components/FocusMode.jsx";
import { GardenPreview } from "./components/GardenPreview.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { StudyGuideGenerator } from "./components/StudyGuideGenerator.jsx";
import { TopGardenBar } from "./components/TopGardenBar.jsx";
import { WatercolorFooter } from "./components/WatercolorFooter.jsx";
import { WeeklyPlan } from "./components/WeeklyPlan.jsx";
import { sampleAssignments } from "./data/sampleAssignments.js";
import { createAssignmentFromForm } from "./utils/assignments.js";
import { defaultOnboardingAnswers } from "./utils/onboarding.js";
import { calculateRisk, sortAssignmentsByRisk } from "./utils/risk.js";
import chibiGardenLine from "./assets/illustrations/chibi-garden-line.png";
import {
  COINS_PER_TASK,
  getCurrentGardenStage,
  getNextGardenStage,
} from "./utils/rewards.js";
import {
  buildPinnedTodayPlan,
  buildWeeklyPlan,
  buildTodayPlan,
  sortTasksByRisk,
} from "./utils/planning.js";
import {
  clearStudySproutStorage,
  loadAddedAssignments,
  loadCompletedTaskIds,
  loadGardenCoins,
  loadGardenStageId,
  loadOnboardingAnswers,
  saveAddedAssignments,
  saveCompletedTaskIds,
  saveGardenCoins,
  saveGardenStageId,
  saveOnboardingAnswers,
} from "./utils/storage.js";

// This gives the prototype a little starting progress without needing accounts yet.
const starterCompletedTaskIds = ["bio-diagram"];
const starterGardenCoins = starterCompletedTaskIds.length * COINS_PER_TASK;
const sampleAssignmentIds = new Set(
  sampleAssignments.map((assignment) => assignment.id),
);

function getDefaultOnboardingAnswers() {
  return {
    ...defaultOnboardingAnswers,
    hardestSubjects: [...defaultOnboardingAnswers.hardestSubjects],
  };
}

function getTodayTaskIds(assignments, completedTaskIds, onboardingAnswers) {
  return buildTodayPlan(assignments, completedTaskIds, onboardingAnswers).map(
    (task) => task.id,
  );
}

// App is the main parent component. It owns the page state and sends data down
// to smaller child components through props.
export default function App() {
  // activeTab is the whole navigation system for now. We are not using React
  // Router yet because these tabs are simple views inside one page.
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [assignmentReturnTab, setAssignmentReturnTab] = useState("dashboard");
  const [focusSession, setFocusSession] = useState(null);

  // Assignments live in state now so the form can add new assignments without a
  // database. The initial value combines built-in demos with saved user work.
  const [assignments, setAssignments] = useState(() => [
    ...sampleAssignments,
    ...loadAddedAssignments(),
  ]);
  const [completedTaskIds, setCompletedTaskIds] = useState(
    () => new Set(loadCompletedTaskIds(starterCompletedTaskIds)),
  );
  const [gardenCoins, setGardenCoins] = useState(() =>
    loadGardenCoins(
      loadCompletedTaskIds(starterCompletedTaskIds).length * COINS_PER_TASK,
    ),
  );
  const [gardenStageId, setGardenStageId] = useState(() =>
    getCurrentGardenStage(loadGardenStageId()).id,
  );
  const [onboardingAnswers, setOnboardingAnswers] = useState(() =>
    loadOnboardingAnswers(),
  );

  // Today's task ids are chosen once when the app loads so the checklist stays
  // stable while a student checks items off.
  const [pinnedTodayTaskIds, setPinnedTodayTaskIds] = useState(() =>
    getTodayTaskIds(
      [...sampleAssignments, ...loadAddedAssignments()],
      new Set(loadCompletedTaskIds(starterCompletedTaskIds)),
      loadOnboardingAnswers(),
    ),
  );

  // useEffect runs after React updates the screen. Here it mirrors user-created
  // assignments into localStorage so they are still there after a refresh.
  useEffect(() => {
    const addedAssignments = assignments.filter(
      (assignment) => !sampleAssignmentIds.has(assignment.id),
    );

    saveAddedAssignments(addedAssignments);
  }, [assignments]);

  // This saves the checklist progress. Sets are useful in React state, but
  // localStorage stores strings, so the helper saves these ids as a JSON array.
  useEffect(() => {
    saveCompletedTaskIds([...completedTaskIds]);
  }, [completedTaskIds]);

  // Garden coins are saved separately from completed task ids. That makes the
  // game loop easy to understand: tasks earn coins, then coins buy upgrades.
  useEffect(() => {
    saveGardenCoins(gardenCoins);
  }, [gardenCoins]);

  // The current garden stage is also saved, so refreshing the browser keeps the
  // upgraded garden instead of returning to Stage 0.
  useEffect(() => {
    saveGardenStageId(gardenStageId);
  }, [gardenStageId]);

  // Onboarding answers are saved locally too. They help personalize risk and
  // planning without needing a sign-in system yet.
  useEffect(() => {
    saveOnboardingAnswers(onboardingAnswers);
  }, [onboardingAnswers]);

  // This adds a risk score to each assignment, then sorts the list so the most
  // urgent assignment appears first.
  const assignmentsWithRisk = useMemo(
    () =>
      sortAssignmentsByRisk(
        assignments.map((assignment) => ({
          ...assignment,
          risk: calculateRisk(assignment, {
            completedTaskIds,
            onboardingAnswers,
            todayTaskIds: pinnedTodayTaskIds,
          }),
        })),
      ),
    [assignments, completedTaskIds, onboardingAnswers, pinnedTodayTaskIds],
  );

  const todayPlan = useMemo(
    () =>
      buildPinnedTodayPlan(
        assignments,
        pinnedTodayTaskIds,
        completedTaskIds,
        onboardingAnswers,
      ),
    [assignments, pinnedTodayTaskIds, completedTaskIds, onboardingAnswers],
  );
  const weeklyPlan = useMemo(
    () => buildWeeklyPlan(assignments, onboardingAnswers),
    [assignments, onboardingAnswers],
  );

  const allTasks = assignments.flatMap((assignment) => assignment.tasks);
  const completedCount = allTasks.filter((task) =>
    completedTaskIds.has(task.id),
  ).length;
  const currentGardenStage = getCurrentGardenStage(gardenStageId);
  const nextGardenStage = getNextGardenStage(gardenStageId);
  const todayCompletedCount = todayPlan.filter((task) =>
    completedTaskIds.has(task.id),
  ).length;
  const totalMinutes = todayPlan.reduce((sum, task) => sum + task.minutes, 0);
  const highestRiskAssignment = assignmentsWithRisk[0];
  const selectedAssignment = assignmentsWithRisk.find(
    (assignment) => assignment.id === selectedAssignmentId,
  );
  const selectedAssignmentPlan = weeklyPlan.find(
    (assignmentPlan) => assignmentPlan.assignmentId === selectedAssignmentId,
  );
  const focusAssignment = assignmentsWithRisk.find(
    (assignment) => assignment.id === focusSession?.assignmentId,
  );
  const focusTask = focusAssignment?.tasks.find(
    (task) => task.id === focusSession?.taskId,
  );

  function changeTab(tabId) {
    setFocusSession(null);
    setSelectedAssignmentId(null);
    setActiveTab(tabId);
  }

  function selectAssignment(assignmentId) {
    setAssignmentReturnTab(activeTab);
    setSelectedAssignmentId(assignmentId);
  }

  function closeAssignmentDetails() {
    setSelectedAssignmentId(null);
    setActiveTab(assignmentReturnTab);
  }

  function startFocusMode(assignmentId, taskId) {
    setFocusSession({ assignmentId, taskId });
  }

  function closeFocusMode() {
    setFocusSession(null);
  }

  function toggleTask(taskId) {
    const wasComplete = completedTaskIds.has(taskId);
    const nextIds = new Set(completedTaskIds);

    if (wasComplete) {
      nextIds.delete(taskId);
    } else {
      nextIds.add(taskId);
    }

    setCompletedTaskIds(nextIds);

    // Completing a task earns coins. Unchecking removes the same reward so the
    // coin total stays tied to actual completed work.
    setGardenCoins((currentCoins) =>
      wasComplete
        ? Math.max(currentCoins - COINS_PER_TASK, 0)
        : currentCoins + COINS_PER_TASK,
    );
  }

  function completeTask(taskId) {
    if (completedTaskIds.has(taskId)) {
      return;
    }

    const nextIds = new Set(completedTaskIds);

    nextIds.add(taskId);
    setCompletedTaskIds(nextIds);
    setGardenCoins((currentCoins) => currentCoins + COINS_PER_TASK);
  }

  function upgradeGarden() {
    if (!nextGardenStage || gardenCoins < nextGardenStage.upgradeCost) {
      return;
    }

    // The Upgrade Garden button spends coins once, then moves to the next fixed
    // stage. The effects above save both values to localStorage.
    setGardenCoins((currentCoins) =>
      Math.max(currentCoins - nextGardenStage.upgradeCost, 0),
    );
    setGardenStageId(nextGardenStage.id);
  }

  function addAssignment(formData) {
    const newAssignment = createAssignmentFromForm(formData);
    const nextAssignments = [...assignments, newAssignment];
    const firstTaskId = newAssignment.tasks[0]?.id;

    setAssignments(nextAssignments);

    // The new assignment joins today's checklist right away. Re-sorting keeps
    // urgent work near the top while preserving the same dashboard design.
    if (firstTaskId) {
      setPinnedTodayTaskIds((currentTaskIds) =>
        sortTasksByRisk(
          buildPinnedTodayPlan(
            nextAssignments,
            [...currentTaskIds, firstTaskId],
            completedTaskIds,
            onboardingAnswers,
          ),
        ).map((task) => task.id),
      );
    }
  }

  function resetSavedData() {
    const resetAssignments = [...sampleAssignments];
    const resetCompletedTaskIds = new Set(starterCompletedTaskIds);
    const resetOnboardingAnswers = getDefaultOnboardingAnswers();

    clearStudySproutStorage();
    setAssignments(resetAssignments);
    setCompletedTaskIds(resetCompletedTaskIds);
    setGardenCoins(starterGardenCoins);
    setGardenStageId("stage-1");
    setOnboardingAnswers(resetOnboardingAnswers);
    setSelectedAssignmentId(null);
    setFocusSession(null);
    setPinnedTodayTaskIds(
      getTodayTaskIds(
        resetAssignments,
        resetCompletedTaskIds,
        resetOnboardingAnswers,
      ),
    );
  }

  function renderActiveTab() {
    if (focusAssignment && focusTask) {
      return (
        <FocusMode
          assignment={focusAssignment}
          completedCount={completedCount}
          completedTaskIds={completedTaskIds}
          onCompleteTask={completeTask}
          onExit={closeFocusMode}
          task={focusTask}
          totalTaskCount={allTasks.length}
        />
      );
    }

    if (selectedAssignment) {
      return (
        <AssignmentDetails
          assignment={selectedAssignment}
          completedTaskIds={completedTaskIds}
          onBack={closeAssignmentDetails}
          onStartFocus={startFocusMode}
          onToggleTask={toggleTask}
          plan={selectedAssignmentPlan}
        />
      );
    }

    if (activeTab === "planner") {
      return (
        <section className="planner-layout" aria-label="Planner">
          <WeeklyPlan onSelectAssignment={selectAssignment} plan={weeklyPlan} />
          <AddAssignmentForm onAddAssignment={addAssignment} />
        </section>
      );
    }

    if (activeTab === "garden") {
      return (
        <section className="single-tab-layout" aria-label="Garden rewards">
          <GardenPreview
            coins={gardenCoins}
            currentStage={currentGardenStage}
            nextStage={nextGardenStage}
            onUpgradeGarden={upgradeGarden}
          />
        </section>
      );
    }

    if (activeTab === "study-guide") {
      return (
        <section className="single-tab-layout" aria-label="Study guide generator">
          <StudyGuideGenerator />
        </section>
      );
    }

    if (activeTab === "settings") {
      return (
        <SettingsPanel
          answers={onboardingAnswers}
          onResetSavedData={resetSavedData}
          onSaveAnswers={setOnboardingAnswers}
        />
      );
    }

    return (
      <Dashboard
        assignments={assignmentsWithRisk}
        completedCount={completedCount}
        completedTaskIds={completedTaskIds}
        currentGardenStage={currentGardenStage}
        gardenCoins={gardenCoins}
        highestRiskAssignment={highestRiskAssignment}
        nextGardenStage={nextGardenStage}
        onNavigate={changeTab}
        onSelectAssignment={selectAssignment}
        onStartFocus={startFocusMode}
        onToggleTask={toggleTask}
        todayCompletedCount={todayCompletedCount}
        todayPlan={todayPlan}
        todayTaskCount={todayPlan.length}
        totalMinutes={totalMinutes}
        totalTaskCount={allTasks.length}
      />
    );
  }

  return (
    <main className="app-shell">
      <AppSidebar
        activeTab={activeTab}
        completedCount={completedCount}
        onTabChange={changeTab}
        totalTaskCount={allTasks.length}
      />

      <section className="app-main-panel">
        <TopGardenBar coins={gardenCoins} chibiGardenLine={chibiGardenLine} />

        <section
          aria-label="Selected StudySprout section"
          className="tab-view"
          id={`${activeTab}-panel`}
        >
          {renderActiveTab()}
        </section>
        <WatercolorFooter />
      </section>
    </main>
  );
}
