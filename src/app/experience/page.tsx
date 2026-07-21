import { getExperience, getEducation } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Himanshu Kumar Portfolio",
  description: "Professional experience, work history, and educational background.",
};

export default async function ExperiencePage() {
  const experienceData = await getExperience();
  const educationData = await getEducation();

  return (
    <div className="page-full">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span>»</span>
        <strong>Experience & Education</strong>
      </div>

      {/* Experience */}
      <div className="panel">
        <div className="panel-header">
          <span>💼 Professional Experience ({experienceData.length})</span>
        </div>
        <div className="panel-body">
          {experienceData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <p className="empty-state-text">No experience entries yet.</p>
            </div>
          ) : (
            <div className="timeline">
              {experienceData.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-date">
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                    {!exp.endDate && (
                      <span style={{ marginLeft: "8px", color: "var(--accent-green)", fontWeight: 600, fontSize: "var(--font-size-xs)" }}>
                        ● CURRENT
                      </span>
                    )}
                  </div>
                  <div className="timeline-title">{exp.role}</div>
                  <div className="timeline-subtitle">{exp.company}</div>
                  {exp.description && (
                    <div className="timeline-description">{exp.description}</div>
                  )}
                  {exp.location && (
                    <div className="timeline-location">📍 {exp.location}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Experience Table View */}
      {experienceData.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <span>📋 Experience — Table View</span>
          </div>
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Role</th>
                <th>Company</th>
                <th>Duration</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {experienceData.map((exp, idx) => (
                <tr key={exp.id}>
                  <td className="col-id">{idx + 1}</td>
                  <td><strong>{exp.role}</strong></td>
                  <td style={{ color: "var(--accent-blue-light)" }}>{exp.company}</td>
                  <td className="text-mono" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                  </td>
                  <td style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
                    {exp.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Education */}
      <div className="panel">
        <div className="panel-header">
          <span>🎓 Education ({educationData.length})</span>
        </div>
        {educationData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <p className="empty-state-text">No education entries yet.</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Institution</th>
                <th>Degree</th>
                <th>Field</th>
                <th>Year</th>
                <th>GPA / Score</th>
              </tr>
            </thead>
            <tbody>
              {educationData.map((edu, idx) => (
                <tr key={edu.id}>
                  <td className="col-id">{idx + 1}</td>
                  <td><strong>{edu.institution}</strong></td>
                  <td>{edu.degree}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{edu.field}</td>
                  <td className="text-mono" style={{ fontSize: "var(--font-size-sm)", whiteSpace: "nowrap" }}>
                    {edu.startYear} — {edu.endYear || "Present"}
                  </td>
                  <td>
                    {edu.gpa && (
                      <span className="rating-badge">{edu.gpa}</span>
                    )}
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
