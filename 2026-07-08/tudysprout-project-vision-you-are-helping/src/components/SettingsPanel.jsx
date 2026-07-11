import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { OnboardingForm } from "./OnboardingForm.jsx";

// SettingsPanel groups app preferences and maintenance actions. Keeping this
// separate from App makes the reset UI easier to read while App still owns the
// real data state.
export function SettingsPanel({ answers, onResetSavedData, onSaveAnswers }) {
  const [resetMessage, setResetMessage] = useState("");

  function handleResetClick() {
    onResetSavedData();
    setResetMessage("Saved data reset. The starter assignments are back.");
  }

  return (
    <section className="settings-layout" aria-label="Settings">
      <OnboardingForm answers={answers} onSaveAnswers={onSaveAnswers} />

      <section className="card settings-card" aria-labelledby="reset-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reset</p>
            <h2 id="reset-heading">Saved browser data</h2>
          </div>
        </div>

        <p className="settings-copy">
          This clears assignments you added, completed task progress, onboarding
          answers, garden coins, garden stage, and the latest study guide draft
          from this browser.
        </p>

        <button className="danger-button" onClick={handleResetClick} type="button">
          <RotateCcw size={18} />
          <span>Reset localStorage</span>
        </button>

        {resetMessage ? (
          <p className="settings-reset-message" aria-live="polite">
            {resetMessage}
          </p>
        ) : null}
      </section>
    </section>
  );
}
