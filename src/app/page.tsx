import { getProfile, getSkills, getFeaturedProjects, getExperience } from "@/lib/actions";
import { getRankClass } from "@/lib/utils";
import Link from "next/link";

export default async function HomePage() {
  const profileData = await getProfile();
  const skillsData = await getSkills();
  const featuredProjects = await getFeaturedProjects();
  const experienceData = await getExperience();

  if (!profileData) {
    return (
      <div className="page-full">
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <p className="empty-state-text">No profile data yet. Set up your profile in the admin panel.</p>
          <Link href="/admin/dashboard" className="btn btn-primary mt-lg">Go to Admin</Link>
        </div>
      </div>
    );
  }

  const rankClass = getRankClass(profileData.rank || "newbie");
  const initials = profileData.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  // Group skills by category
  const skillsByCategory: Record<string, typeof skillsData> = {};
  skillsData.forEach((skill) => {
    const cat = skill.category || "Other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  });

  return (
    <div className="page-container">
      <div className="page-main">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <div className="profile-handle">
                <span className={rankClass}>{profileData.handle || profileData.fullName}</span>
              </div>
              <div className="profile-title-text">{profileData.title}</div>
              <div className="profile-meta">
                {profileData.location && (
                  <span className="profile-meta-item">📍 {profileData.location}</span>
                )}
                <span className="profile-meta-item">
                  ⭐ Rating: <strong className={rankClass}>{profileData.rating}</strong>
                </span>
                <span className="profile-meta-item" style={{ textTransform: "capitalize" }}>
                  🏅 {profileData.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card-body">
            {/* Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{featuredProjects.length}</div>
                <div className="profile-stat-label">Featured Projects</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{skillsData.length}</div>
                <div className="profile-stat-label">Skills</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{experienceData.length}</div>
                <div className="profile-stat-label">Positions</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">{profileData.rating}</div>
                <div className="profile-stat-label">Rating</div>
              </div>
            </div>

            {/* Bio */}
            <p className="profile-bio">{profileData.bio}</p>

            {/* Links */}
            <div className="profile-links">
              {profileData.githubUrl && (
                <a
                  href={profileData.githubUrl}
                  className="profile-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⟨/⟩ GitHub
                </a>
              )}
              {profileData.linkedinUrl && (
                <a
                  href={profileData.linkedinUrl}
                  className="profile-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 LinkedIn
                </a>
              )}
              {profileData.resumeUrl && (
                <a
                  href={profileData.resumeUrl}
                  className="profile-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Resume
                </a>
              )}
              <Link href="/contact" className="profile-link">
                ✉ Contact Me
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="panel">
            <div className="panel-header">
              <span>★ Featured Projects</span>
              <Link href="/projects" className="btn btn-sm btn-secondary">
                View All →
              </Link>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="col-id">#</th>
                  <th>Title</th>
                  <th>Tech Stack</th>
                  <th className="col-status">Status</th>
                  <th>Links</th>
                </tr>
              </thead>
              <tbody>
                {featuredProjects.map((project, idx) => (
                  <tr key={project.id}>
                    <td className="col-id">{idx + 1}</td>
                    <td>
                      <strong>{project.title}</strong>
                      <div className="text-muted" style={{ fontSize: "var(--font-size-xs)", marginTop: "2px" }}>
                        {project.description?.substring(0, 80)}...
                      </div>
                    </td>
                    <td>
                      <div className="tech-tags">
                        {project.techStack?.split(",").slice(0, 3).map((tech, i) => (
                          <span key={i} className="tech-tag">{tech.trim()}</span>
                        ))}
                        {(project.techStack?.split(",").length || 0) > 3 && (
                          <span className="tech-tag">+{(project.techStack?.split(",").length || 0) - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="col-status">
                      <span className={`status-badge ${project.status === "completed" ? "status-completed" : project.status === "in-progress" ? "status-in-progress" : "status-archived"}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        {project.liveUrl && (
                          <a href={project.liveUrl} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">
                            Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} className="btn btn-sm btn-secondary" target="_blank" rel="noopener noreferrer">
                            Code
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Experience */}
        {experienceData.length > 0 && (
          <div className="panel">
            <div className="panel-header">
              <span>💼 Recent Experience</span>
              <Link href="/experience" className="btn btn-sm btn-secondary">
                View All →
              </Link>
            </div>
            <div className="panel-body">
              {experienceData.slice(0, 2).map((exp) => (
                <div key={exp.id} style={{ marginBottom: "var(--space-lg)", paddingBottom: "var(--space-lg)", borderBottom: "1px dotted var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong style={{ fontSize: "var(--font-size-md)" }}>{exp.role}</strong>
                      <div style={{ color: "var(--accent-blue-light)", fontSize: "var(--font-size-base)" }}>
                        {exp.company}
                      </div>
                    </div>
                    <span className="text-mono text-muted" style={{ fontSize: "var(--font-size-xs)" }}>
                      {exp.startDate} — {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-muted mt-sm" style={{ fontSize: "var(--font-size-sm)" }}>
                    {exp.description?.substring(0, 120)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="page-sidebar">
        {/* Quick Info */}
        <div className="sidebar-panel">
          <div className="sidebar-panel-header">User Info</div>
          <div className="sidebar-panel-body">
            <ul className="sidebar-list">
              <li>
                <span className="sidebar-list-label">Handle</span>
                <span className={`sidebar-list-value ${rankClass}`}>{profileData.handle}</span>
              </li>
              <li>
                <span className="sidebar-list-label">Rating</span>
                <span className={`sidebar-list-value ${rankClass}`}>{profileData.rating}</span>
              </li>
              <li>
                <span className="sidebar-list-label">Rank</span>
                <span className="sidebar-list-value" style={{ textTransform: "capitalize" }}>{profileData.rank}</span>
              </li>
              <li>
                <span className="sidebar-list-label">Location</span>
                <span className="sidebar-list-value">{profileData.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Skills Summary */}
        <div className="sidebar-panel">
          <div className="sidebar-panel-header">Top Skills</div>
          <div className="sidebar-panel-body">
            <ul className="sidebar-list">
              {skillsData.slice(0, 8).map((skill) => (
                <li key={skill.id}>
                  <span className="sidebar-list-label">{skill.name}</span>
                  <span className="sidebar-list-value">{skill.proficiency}%</span>
                </li>
              ))}
            </ul>
            {skillsData.length > 8 && (
              <div className="mt-sm">
                <Link href="/skills" style={{ fontSize: "var(--font-size-xs)" }}>
                  View all {skillsData.length} skills →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-panel">
          <div className="sidebar-panel-header">Quick Links</div>
          <div className="sidebar-panel-body">
            <ul className="sidebar-list">
              <li><Link href="/projects">📁 All Projects</Link></li>
              <li><Link href="/skills">📊 Skills & Proficiency</Link></li>
              <li><Link href="/experience">💼 Experience & Education</Link></li>
              <li><Link href="/contact">✉ Contact Form</Link></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
