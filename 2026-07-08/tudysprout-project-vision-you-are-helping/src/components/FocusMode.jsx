import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { MossyAvatar } from "./MossyAvatar.jsx";
import { getDueDateLabel, getDueStatusLabel } from "../utils/dashboard.js";
import { COINS_PER_TASK } from "../utils/rewards.js";

// FocusMode is a distraction-light study screen for one assignment task.
// App chooses the assignment and task, then this component handles the timer UI.
export function FocusMode({
  assignment,
  completedCount,
  completedTaskIds,
  onCompleteTask,
  onExit,
  task,
  totalTaskCount,
}) {
  const taskMinutes = task.minutes ?? 10;
  const startingSeconds = taskMinutes * 60;
  const isTaskComplete = completedTaskIds.has(task.id);
  const [remainingSeconds, setRemainingSeconds] = useState(startingSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const mossyMessage = sessionSummary
    ? "That step is complete. Take the win before you choose the next tiny thing."
    : isTaskComplete
      ? "You finished the step. Mossy is absolutely counting this as real progress."
      : "Stay with this one small step. You do not have to solve the whole day at once.";

  // When the user opens a different task, reset the timer to that task's minutes.
  useEffect(() => {
    setRemainingSeconds(startingSeconds);
    setElapsedSeconds(0);
    setIsRunning(false);
    setSessionSummary(null);
  }, [startingSeconds, task.id]);

  // This effect is the countdown. It starts an interval only while the timer is
  // running, then cleans it up so React does not leave old timers behind.
  useEffect(() => {
    if (!isRunning || remainingSeconds === 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      setIsRunning(false);
    }
  }, [remainingSeconds]);

  const formattedTime = useMemo(
    () => formatSeconds(remainingSeconds),
    [remainingSeconds],
  );

  function resetTimer() {
    setRemainingSeconds(startingSeconds);
    setElapsedSeconds(0);
    setSessionSummary(null);
    setIsRunning(false);
  }

  function completeStep() {
    onCompleteTask(task.id);
    setIsRunning(false);
    setSessionSummary({
      completedCountAfter: isTaskComplete ? completedCount : completedCount + 1,
      riskBeforeLabel: assignment.risk.label,
      riskBeforeScore: assignment.risk.score,
      taskLabel: task.label,
      timeSpentSeconds: elapsedSeconds,
      wasAlreadyComplete: isTaskComplete,
    });
  }

  return (
    <section className="focus-mode" aria-labelledby="focus-mode-heading">
      <button className="secondary-button detail-back-button" onClick={onExit} type="button">
        <ArrowLeft size={18} />
        <span>Exit Focus</span>
      </button>

      <section className="focus-mode-shell">
        <div className="focus-mode-header">
          <div>
            <p className="eyebrow">Focus mode</p>
            <h1 id="focus-mode-heading">{assignment.title}</h1>
            <p className="dashboard-subtitle">
              {assignment.course} · {getDueDateLabel(assignment)} ·{" "}
              {getDueStatusLabel(assignment)}
            </p>
          </div>

          <span className={`risk-badge ${assignment.risk.tone}`}>
            {assignment.risk.label}
          </span>
        </div>

        <div className="focus-mode-grid">
          <section className="card focus-task-card">
            <div className="dashboard-card-heading">
              <div>
                <p className="eyebrow">Current task</p>
                <h2>{task.label}</h2>
              </div>
              <div className="time-pill">
                <Clock3 size={18} />
                <span>{taskMinutes} min</span>
              </div>
            </div>

            <p className="focus-task-copy">
              Work on just this step. When it is done, mark it complete and your
              dashboard progress will update everywhere.
            </p>

            <button
              className="focus-complete-button"
              disabled={isTaskComplete}
              onClick={completeStep}
              type="button"
            >
              <CheckCircle2 size={20} />
              <span>{isTaskComplete ? "Step Complete" : "Complete Step"}</span>
            </button>
          </section>

          <section className="card focus-timer-card">
            <p className="eyebrow">Timer</p>
            <div className="focus-timer-display" aria-live="polite">
              {formattedTime}
            </div>

            <div className="focus-timer-actions">
              <button
                className="focus-start-button"
                disabled={remainingSeconds === 0}
                onClick={() => setIsRunning(true)}
                type="button"
              >
                <Play size={18} />
                <span>Start</span>
              </button>
              <button
                className="secondary-button"
                onClick={() => setIsRunning(false)}
                type="button"
              >
                <Pause size={18} />
                <span>Pause</span>
              </button>
              <button className="secondary-button" onClick={resetTimer} type="button">
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </section>

          <aside className="card focus-mossy-card" aria-label="Mossy encouragement">
            <div className="mossy-card-top">
              <MossyAvatar size="small" />

              <div>
                <p className="companion-name">Mossy</p>
                <span
                  className={`companion-status ${
                    isTaskComplete ? "proud" : "encouraging"
                  }`}
                >
                  {isTaskComplete ? "Proud" : "Encouraging"}
                </span>
              </div>
            </div>

            <p className="mossy-dashboard-message">{mossyMessage}</p>
          </aside>

          {sessionSummary ? (
            <section className="card focus-summary-card" aria-live="polite">
              <div className="dashboard-card-heading">
                <div>
                  <p className="eyebrow">Session summary</p>
                  <h2>Nice work finishing a step</h2>
                </div>
                <Sparkles size={22} />
              </div>

              <div className="focus-summary-grid">
                <SummaryItem label="Finished" value={sessionSummary.taskLabel} />
                <SummaryItem
                  label="Time spent"
                  value={formatStudyDuration(sessionSummary.timeSpentSeconds)}
                />
                <SummaryItem
                  label="Risk impact"
                  value={getRiskImpactText(sessionSummary, assignment.risk)}
                />
                <SummaryItem
                  label="Coins earned"
                  value={getGardenProgressText({
                    completedCountAfter: sessionSummary.completedCountAfter,
                    totalTaskCount,
                    wasAlreadyComplete: sessionSummary.wasAlreadyComplete,
                  })}
                />
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="focus-summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatStudyDuration(totalSeconds) {
  if (totalSeconds < 60) {
    return totalSeconds === 0 ? "Less than 1 minute" : `${totalSeconds} seconds`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`;
}

function getRiskImpactText(sessionSummary, currentRisk) {
  if (sessionSummary.wasAlreadyComplete) {
    return `${currentRisk.label} (${currentRisk.score}%). This step was already complete.`;
  }

  if (sessionSummary.riskBeforeScore === currentRisk.score) {
    return `${currentRisk.label} (${currentRisk.score}%), with one fewer unfinished step.`;
  }

  return `${sessionSummary.riskBeforeLabel} (${sessionSummary.riskBeforeScore}%) to ${currentRisk.label} (${currentRisk.score}%).`;
}

function getGardenProgressText({
  completedCountAfter,
  totalTaskCount,
  wasAlreadyComplete,
}) {
  if (wasAlreadyComplete) {
    return `Already complete. ${completedCountAfter} of ${totalTaskCount} steps done.`;
  }

  return `+${COINS_PER_TASK} coins. ${completedCountAfter} of ${totalTaskCount} steps complete.`;
}
