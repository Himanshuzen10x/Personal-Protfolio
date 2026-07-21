import { getProjects } from "@/lib/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Himanshu Kumar Portfolio",
  description: "Browse all projects built by Himanshu Kumar — full stack web applications, tools, and open-source contributions.",
};

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return (
    <div className="page-full">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span>»</span>
        <strong>Projects</strong>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>📁 Problem Set — Projects ({projectsData.length})</span>
        </div>

        {projectsData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <p className="empty-state-text">No projects yet.</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Tech Stack</th>
                <th className="col-status">Status</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {projectsData.map((project, idx) => (
                <tr key={project.id}>
                  <td className="col-id" style={{ fontWeight: 700 }}>
                    {String.fromCharCode(65 + idx)}
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent-blue)" }}>{project.title}</strong>
                    {project.featured === 1 && (
                      <span style={{ marginLeft: "6px", color: "var(--accent-orange)", fontSize: "var(--font-size-xs)" }}>★ Featured</span>
                    )}
                  </td>
                  <td style={{ maxWidth: "300px", fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>
                    {project.description}
                  </td>
                  <td>
                    <div className="tech-tags">
                      {project.techStack?.split(",").map((tech, i) => (
                        <span key={i} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  </td>
                  <td className="col-status">
                    <span className={`status-badge ${project.status === "completed" ? "status-completed" : project.status === "in-progress" ? "status-in-progress" : "status-archived"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" style={{ flexDirection: "column" }}>
                      {project.liveUrl && (
                        <a href={project.liveUrl} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">
                          🌐 Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="btn btn-sm btn-secondary" target="_blank" rel="noopener noreferrer">
                          ⟨/⟩ Source
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="panel-footer">
          Showing {projectsData.length} project(s) • Sorted by display order
        </div>
      </div>
    </div>
  );
}
