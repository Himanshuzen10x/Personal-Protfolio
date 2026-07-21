"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/lib/actions";

interface Experience {
  id: number;
  company: string;
  role: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  displayOrder: number | null;
}

export default function AdminExperienceClient({ experiences }: { experiences: Experience[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    try {
      if (editingExp) {
        formData.set("id", String(editingExp.id));
        await updateExperience(formData);
      } else {
        await createExperience(formData);
      }
      setStatus("saved");
      setShowForm(false);
      setEditingExp(null);
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteExperience(fd);
  }

  return (
    <div>
      {status === "saved" && <div className="alert alert-success">✓ Experience saved successfully!</div>}

      {showForm && (
        <div className="panel mb-lg">
          <div className="panel-header">
            <span>{editingExp ? "✏️ Edit Experience" : "➕ Add Experience"}</span>
            <button className="btn btn-sm btn-secondary" onClick={() => { setShowForm(false); setEditingExp(null); }}>Cancel</button>
          </div>
          <div className="panel-body">
            <form action={handleSubmit} className="cf-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label htmlFor="exp-company" className="form-label">Company *</label>
                  <input type="text" id="exp-company" name="company" className="form-input" required defaultValue={editingExp?.company || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-role" className="form-label">Role *</label>
                  <input type="text" id="exp-role" name="role" className="form-input" required defaultValue={editingExp?.role || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-startDate" className="form-label">Start Date</label>
                  <input type="month" id="exp-startDate" name="startDate" className="form-input" defaultValue={editingExp?.startDate || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-endDate" className="form-label">End Date (leave empty for current)</label>
                  <input type="month" id="exp-endDate" name="endDate" className="form-input" defaultValue={editingExp?.endDate || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-location" className="form-label">Location</label>
                  <input type="text" id="exp-location" name="location" className="form-input" defaultValue={editingExp?.location || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-displayOrder" className="form-label">Display Order</label>
                  <input type="number" id="exp-displayOrder" name="displayOrder" className="form-input" defaultValue={editingExp?.displayOrder || 0} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exp-description" className="form-label">Description</label>
                <textarea id="exp-description" name="description" className="form-textarea" rows={3} defaultValue={editingExp?.description || ""} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : editingExp ? "Update Experience" : "Add Experience"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <span>💼 All Experience ({experiences.length})</span>
          {!showForm && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>+ Add Experience</button>
          )}
        </div>
        {experiences.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <p className="empty-state-text">No experience entries yet.</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Role</th>
                <th>Company</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, idx) => (
                <tr key={exp.id}>
                  <td className="col-id">{idx + 1}</td>
                  <td><strong>{exp.role}</strong></td>
                  <td style={{ color: "var(--accent-blue-light)" }}>{exp.company}</td>
                  <td className="text-mono" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                    {exp.startDate} — {exp.endDate || "Present"}
                  </td>
                  <td style={{ fontSize: "var(--font-size-sm)" }}>{exp.location}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary" onClick={() => { setEditingExp(exp); setShowForm(true); }}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
