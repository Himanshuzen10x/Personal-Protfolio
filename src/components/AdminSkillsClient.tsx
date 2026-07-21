"use client";

import { useState } from "react";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions";
import { getProficiencyColor } from "@/lib/utils";

interface Skill {
  id: number;
  name: string;
  category: string | null;
  proficiency: number | null;
  displayOrder: number | null;
}

export default function AdminSkillsClient({ skills }: { skills: Skill[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    try {
      if (editingSkill) {
        formData.set("id", String(editingSkill.id));
        await updateSkill(formData);
      } else {
        await createSkill(formData);
      }
      setStatus("saved");
      setShowForm(false);
      setEditingSkill(null);
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteSkill(fd);
  }

  return (
    <div>
      {status === "saved" && <div className="alert alert-success">✓ Skill saved successfully!</div>}

      {showForm && (
        <div className="panel mb-lg">
          <div className="panel-header">
            <span>{editingSkill ? "✏️ Edit Skill" : "➕ Add New Skill"}</span>
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowForm(false); setEditingSkill(null); }}>Cancel</button>
          </div>
          <div className="panel-body">
            <form action={handleSubmit} className="cf-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label htmlFor="skill-name" className="form-label">Skill Name *</label>
                  <input type="text" id="skill-name" name="name" className="form-input" required defaultValue={editingSkill?.name || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="skill-category" className="form-label">Category</label>
                  <select id="skill-category" name="category" className="form-select" defaultValue={editingSkill?.category || "Language"}>
                    <option value="Language">Language</option>
                    <option value="Framework">Framework</option>
                    <option value="Tool">Tool</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="skill-proficiency" className="form-label">Proficiency (0-100)</label>
                  <input type="number" id="skill-proficiency" name="proficiency" className="form-input" min="0" max="100" defaultValue={editingSkill?.proficiency || 50} />
                </div>
                <div className="form-group">
                  <label htmlFor="skill-displayOrder" className="form-label">Display Order</label>
                  <input type="number" id="skill-displayOrder" name="displayOrder" className="form-input" defaultValue={editingSkill?.displayOrder || 0} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : editingSkill ? "Update Skill" : "Add Skill"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <span>💻 All Skills ({skills.length})</span>
          {!showForm && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>+ Add Skill</button>
          )}
        </div>
        {skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💻</div>
            <p className="empty-state-text">No skills yet.</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Skill</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, idx) => {
                const colorClass = getProficiencyColor(skill.proficiency || 0);
                return (
                  <tr key={skill.id}>
                    <td className="col-id">{idx + 1}</td>
                    <td><strong>{skill.name}</strong></td>
                    <td>{skill.category}</td>
                    <td>
                      <div className="proficiency-bar-container">
                        <div className="proficiency-bar" style={{ maxWidth: "120px" }}>
                          <div className={`proficiency-bar-fill ${colorClass}`} style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="proficiency-value">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="text-mono text-center">{skill.displayOrder}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingSkill(skill); setShowForm(true); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(skill.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
