import { useEffect, useState } from "react";
import { BookOpenCheck, WandSparkles } from "lucide-react";
import { generateStudyGuide } from "../utils/studyGuide.js";
import {
  loadStudyGuideDraft,
  saveStudyGuideDraft,
} from "../utils/storage.js";

// StudyGuideGenerator lets students paste notes and creates a simple study guide.
// For now, it uses local JavaScript rules instead of an AI or backend call.
export function StudyGuideGenerator() {
  // This state only holds the first browser-saved draft. Keeping it separate
  // prevents the component from reading localStorage on every re-render.
  const [savedDraft] = useState(() => loadStudyGuideDraft());

  // Notes and studyGuide are separate pieces of React state because the notes
  // can change many times before the student generates a new guide.
  const [notes, setNotes] = useState(savedDraft.notes);
  const [studyGuide, setStudyGuide] = useState(savedDraft.studyGuide);

  // Every change is saved locally so refreshing the page does not erase the
  // latest notes or generated study guide.
  useEffect(() => {
    saveStudyGuideDraft({ notes, studyGuide });
  }, [notes, studyGuide]);

  function handleGenerateStudyGuide(event) {
    event.preventDefault();
    setStudyGuide(generateStudyGuide(notes));
  }

  return (
    <section className="card study-guide-card" aria-labelledby="study-guide-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Study guide</p>
          <h2 id="study-guide-heading">Notes to study guide</h2>
        </div>
      </div>

      <form className="study-guide-form" onSubmit={handleGenerateStudyGuide}>
        <label className="form-field">
          <span>Paste lecture notes</span>
          <textarea
            name="lectureNotes"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste class notes, textbook notes, or review bullets here..."
            required
            rows="8"
            value={notes}
          />
        </label>

        <button className="submit-button" type="submit">
          <WandSparkles size={18} />
          <span>Generate Study Guide</span>
        </button>
      </form>

      <div className="study-guide-output" aria-live="polite">
        <StudyGuideSection
          title="Short summary"
          emptyText="Your summary will appear here."
          items={studyGuide.summary ? [studyGuide.summary] : []}
          type="paragraph"
        />
        <StudyGuideSection
          title="Key terms"
          emptyText="Key terms will appear after generation."
          items={studyGuide.keyTerms}
          type="chips"
        />
        <StudyGuideSection
          title="Possible quiz questions"
          emptyText="Quiz questions will appear after generation."
          items={studyGuide.quizQuestions}
          type="list"
        />
        <StudyGuideSection
          title="Action steps"
          emptyText="Study actions will appear after generation."
          items={studyGuide.actionSteps}
          type="list"
        />
      </div>
    </section>
  );
}

function StudyGuideSection({ emptyText, items, title, type }) {
  return (
    <article className="study-guide-section">
      <h3>
        <BookOpenCheck size={18} />
        <span>{title}</span>
      </h3>

      {items.length === 0 ? (
        <p className="study-guide-empty">{emptyText}</p>
      ) : type === "chips" ? (
        <div className="study-guide-chips">
          {items.map((item) => (
            <span className="study-guide-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : type === "paragraph" ? (
        <p className="study-guide-summary">{items[0]}</p>
      ) : (
        <ul className="study-guide-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
