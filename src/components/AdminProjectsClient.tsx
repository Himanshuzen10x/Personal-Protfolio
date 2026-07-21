"use client";

import { useState } from "react";
import { createProject, updateProject, deleteProject } from "@/lib/actions";

interface Project {
  id: number;
  title: string;
  description: string | null;
  techStack: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  status: string | null;
  featured: number | null;
  displayOrder: number | null;
}

export default function AdminProjectsClient({ projects }: { projects: Project[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    try {
      if (editingProject) {
        formData.set("id", String(editingProject.id));
        await updateProject(formData);
      } else {
        await createProject(formData);
      }
      setStatus("saved");
      setShowForm(false);
      setEditingProject(null);
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteProject(fd);
  }

  function startEdit(project: Project) {
    setEditingProject(project);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingProject(null);
  }

  return (
    <div>
      {status === "saved" && <div className="alert alert-success">✓ Project saved successfully!</div>}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="panel mb-lg">
          <div className="panel-header">
            <span>{editingProject ? "✏️ Edit Project" : "➕ Add New Project"}</span>
            <button className="btn btn-sm btn-secondary" onClick={cancelForm}>Cancel</button>
          </div>
          <div className="panel-body">
            <form action={handleSubmit} className="cf-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label htmlFor="proj-title" className="form-label">Title *</label>
                  <input type="text" id="proj-title" name="title" className="form-input" required defaultValue={editingProject?.title || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="proj-techStack" className="form-label">Tech Stack (comma-separated)</label>
                  <input type="text" id="proj-techStack" name="techStack" className="form-input" defaultValue={editingProject?.techStack || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="proj-liveUrl" className="form-label">Live URL</label>
                  <input type="url" id="proj-liveUrl" name="liveUrl" className="form-input" defaultValue={editingProject?.liveUrl || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="proj-githubUrl" className="form-label">GitHub URL</label>
                  <input type="url" id="proj-githubUrl" name="githubUrl" className="form-input" defaultValue={editingProject?.githubUrl || ""} />
                </div>
                <div className="form-group">
                  <label htmlFor="proj-status" className="form-label">Status</label>
                  <select id="proj-status" name="status" className="form-select" defaultValue={editingProject?.status || "completed"}>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="proj-displayOrder" className="form-label">Display Order</label>
                  <input type="number" id="proj-displayOrder" name="displayOrder" className="form-input" defaultValue={editingProject?.displayOrder || 0} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="proj-description" className="form-label">Description</label>
                <textarea id="proj-description" name="description" className="form-textarea" rows={3} defaultValue={editingProject?.description || ""} />
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer" }}>
                  <input type="checkbox" name="featured" defaultChecked={editingProject?.featured === 1} />
                  <span className="form-label" style={{ margin: 0 }}>Featured Project</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="panel">
        <div className="panel-header">
          <span>📁 All Projects ({projects.length})</span>
          {!showForm && (
            <button className="btn btn-sm btn-primary" onClick={() => setShowForm(true)}>
              + Add Project
            </button>
          )}
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <p className="empty-state-text">No projects yet. Add your first project!</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Title</th>
                <th>Tech Stack</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, idx) => (
                <tr key={project.id}>
                  <td className="col-id">{idx + 1}</td>
                  <td><strong>{project.title}</strong></td>
                  <td>
                    <div className="tech-tags">
                      {project.techStack?.split(",").slice(0, 3).map((t, i) => (
                        <span key={i} className="tech-tag">{t.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${project.status === "completed" ? "status-completed" : project.status === "in-progress" ? "status-in-progress" : "status-archived"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="text-center">{project.featured ? "★" : "—"}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-secondary" onClick={() => startEdit(project)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
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
