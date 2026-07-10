import { useState } from "react";
import { PlusCircle } from "lucide-react";

const emptyForm = {
  title: "",
  course: "",
  dueDate: "",
  estimatedHours: "",
  difficulty: "medium",
  taskSteps: "",
};

// AddAssignmentForm owns only the form inputs. It sends the completed form data
// up to App so App can add the assignment to the dashboard state.
export function AddAssignmentForm({ onAddAssignment }) {
  const [formData, setFormData] = useState(emptyForm);

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onAddAssignment(formData);
    setFormData(emptyForm);
  }

  return (
    <section className="card add-card" aria-labelledby="add-assignment-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add assignment</p>
          <h2 id="add-assignment-heading">Plant a new plan</h2>
        </div>
      </div>

      <form className="assignment-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field">
            <span>Assignment title</span>
            <input
              name="title"
              onChange={updateField}
              placeholder="Research paper"
              required
              type="text"
              value={formData.title}
            />
          </label>

          <label className="form-field">
            <span>Class name</span>
            <input
              name="course"
              onChange={updateField}
              placeholder="English"
              required
              type="text"
              value={formData.course}
            />
          </label>

          <label className="form-field">
            <span>Due date</span>
            <input
              name="dueDate"
              onChange={updateField}
              required
              type="date"
              value={formData.dueDate}
            />
          </label>

          <label className="form-field">
            <span>Estimated hours</span>
            <input
              min="0.5"
              name="estimatedHours"
              onChange={updateField}
              placeholder="3"
              required
              step="0.5"
              type="number"
              value={formData.estimatedHours}
            />
          </label>

          <label className="form-field">
            <span>Difficulty</span>
            <select
              name="difficulty"
              onChange={updateField}
              value={formData.difficulty}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>First few task steps</span>
          <textarea
            name="taskSteps"
            onChange={updateField}
            placeholder={"Read the directions\nMake a tiny outline\nWork for 25 minutes"}
            required
            rows="4"
            value={formData.taskSteps}
          />
        </label>

        <button className="submit-button" type="submit">
          <PlusCircle size={18} />
          <span>Add assignment</span>
        </button>
      </form>
    </section>
  );
}
