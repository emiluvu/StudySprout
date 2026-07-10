import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { defaultOnboardingAnswers } from "../utils/onboarding.js";

const subjectOptions = [
  { label: "Math", value: "math" },
  { label: "Science", value: "science" },
  { label: "English", value: "english" },
  { label: "History", value: "history" },
  { label: "Languages", value: "languages" },
  { label: "Computer science", value: "computer-science" },
];

// OnboardingForm asks about study habits and keeps a local draft while the user
// edits. When saved, App receives the answers and stores them in localStorage.
export function OnboardingForm({ answers, onSaveAnswers }) {
  const [draftAnswers, setDraftAnswers] = useState(answers);

  // If saved answers are loaded from localStorage, this keeps the form fields
  // synced with the latest version from App.
  useEffect(() => {
    setDraftAnswers(answers);
  }, [answers]);

  function updateField(event) {
    const { name, value } = event.target;

    setDraftAnswers((currentAnswers) => ({
      ...currentAnswers,
      [name]: value,
    }));
  }

  function toggleSubject(subjectValue) {
    setDraftAnswers((currentAnswers) => {
      const currentSubjects = currentAnswers.hardestSubjects;
      const hasSubject = currentSubjects.includes(subjectValue);

      return {
        ...currentAnswers,
        hardestSubjects: hasSubject
          ? currentSubjects.filter((subject) => subject !== subjectValue)
          : [...currentSubjects, subjectValue],
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSaveAnswers(draftAnswers);
  }

  function resetAnswers() {
    onSaveAnswers(defaultOnboardingAnswers);
  }

  return (
    <section className="card onboarding-card" aria-labelledby="onboarding-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Personalize</p>
          <h2 id="onboarding-heading">Study style check-in</h2>
        </div>
      </div>

      <form className="onboarding-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>What time of day do you focus best?</span>
            <select
              name="focusTime"
              onChange={updateField}
              value={draftAnswers.focusTime}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="late-night">Late night</option>
            </select>
          </label>

          <label className="form-field">
            <span>Do you usually start early or last minute?</span>
            <select
              name="startStyle"
              onChange={updateField}
              value={draftAnswers.startStyle}
            >
              <option value="early">I start early</option>
              <option value="mixed">It depends</option>
              <option value="last-minute">Usually last minute</option>
            </select>
          </label>

          <label className="form-field">
            <span>How long can you study before a break?</span>
            <select
              name="focusMinutes"
              onChange={updateField}
              value={draftAnswers.focusMinutes}
            >
              <option value="15">15 minutes</option>
              <option value="25">25 minutes</option>
              <option value="40">40 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>

          <label className="form-field">
            <span>Do you prefer short tasks or longer sessions?</span>
            <select
              name="sessionPreference"
              onChange={updateField}
              value={draftAnswers.sessionPreference}
            >
              <option value="short">Short tasks</option>
              <option value="balanced">A mix of both</option>
              <option value="long">Longer sessions</option>
            </select>
          </label>

          <label className="form-field">
            <span>Do you underestimate assignment time?</span>
            <select
              name="underestimatesTime"
              onChange={updateField}
              value={draftAnswers.underestimatesTime}
            >
              <option value="no">Not usually</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
            </select>
          </label>
        </div>

        <fieldset className="subject-fieldset">
          <legend>Which subjects feel hardest?</legend>
          <div className="subject-options">
            {subjectOptions.map((subject) => (
              <label className="subject-chip" key={subject.value}>
                <input
                  checked={draftAnswers.hardestSubjects.includes(subject.value)}
                  onChange={() => toggleSubject(subject.value)}
                  type="checkbox"
                />
                <span>{subject.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="submit-button" type="submit">
            <SlidersHorizontal size={18} />
            <span>Save study style</span>
          </button>
          <button className="secondary-button" onClick={resetAnswers} type="button">
            Reset answers
          </button>
        </div>
      </form>
    </section>
  );
}
