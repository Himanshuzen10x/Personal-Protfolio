import { getSkills } from "@/lib/actions";
import { getProficiencyColor } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Himanshu Kumar Portfolio",
  description: "Technical skills and proficiency levels — languages, frameworks, tools, and technologies.",
};

export default async function SkillsPage() {
  const skillsData = await getSkills();

  // Group by category
  const skillsByCategory: Record<string, typeof skillsData> = {};
  skillsData.forEach((skill) => {
    const cat = skill.category || "Other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  });

  const categoryIcons: Record<string, string> = {
    Language: "💻",
    Framework: "🔧",
    Tool: "🛠️",
    Other: "📦",
  };

  return (
    <div className="page-full">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span>»</span>
        <strong>Skills</strong>
      </div>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category} className="panel">
          <div className="panel-header">
            <span>{categoryIcons[category] || "📦"} {category}s ({categorySkills.length})</span>
          </div>
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Skill</th>
                <th style={{ width: "50%" }}>Proficiency</th>
                <th style={{ width: "80px", textAlign: "center" }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {categorySkills.map((skill, idx) => {
                const colorClass = getProficiencyColor(skill.proficiency || 0);
                return (
                  <tr key={skill.id}>
                    <td className="col-id">{idx + 1}</td>
                    <td>
                      <strong>{skill.name}</strong>
                    </td>
                    <td>
                      <div className="proficiency-bar-container">
                        <div className="proficiency-bar">
                          <div
                            className={`proficiency-bar-fill ${colorClass}`}
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="proficiency-value">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="rating-badge">
                        <span className={colorClass.replace("prof-", "rank-").replace("rank-cyan", "rank-specialist").replace("rank-violet", "rank-candidate-master")}>
                          {Math.round((skill.proficiency || 0) / 100 * 3000)}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Legend */}
      <div className="panel">
        <div className="panel-header">
          <span>📊 Rating Scale Legend</span>
        </div>
        <div className="panel-body">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-newbie)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Beginner (0-39%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-pupil)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Familiar (40-49%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-specialist)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Proficient (50-59%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-expert)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Advanced (60-69%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-candidate-master)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Expert (70-79%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-master)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Master (80-89%)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ width: 12, height: 12, background: "var(--rating-grandmaster)", display: "inline-block" }}></span>
              <span style={{ fontSize: "var(--font-size-sm)" }}>Grandmaster (90-100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
