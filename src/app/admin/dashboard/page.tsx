import { getProjects, getSkills, getExperience, getMessages, getUnreadMessageCount, getProfile } from "@/lib/actions";
import Link from "next/link";

export default async function AdminDashboard() {
  const projectsData = await getProjects();
  const skillsData = await getSkills();
  const experienceData = await getExperience();
  const messagesData = await getMessages();
  const unreadCount = await getUnreadMessageCount();
  const profileData = await getProfile();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Portfolio overview and quick actions</p>
        </div>
        <Link href="/" className="btn btn-secondary" target="_blank">
          🌐 View Site
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">📁</div>
          <div className="stat-card-value">{projectsData.length}</div>
          <div className="stat-card-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💻</div>
          <div className="stat-card-value">{skillsData.length}</div>
          <div className="stat-card-label">Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">💼</div>
          <div className="stat-card-value">{experienceData.length}</div>
          <div className="stat-card-label">Experience</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">✉</div>
          <div className="stat-card-value">{messagesData.length}</div>
          <div className="stat-card-label">Messages</div>
        </div>
      </div>

      {/* Unread Messages Alert */}
      {unreadCount > 0 && (
        <div className="alert alert-warning">
          <strong>📬 You have {unreadCount} unread message{unreadCount > 1 ? "s" : ""}.</strong>{" "}
          <Link href="/admin/messages">View Messages →</Link>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
        {/* Recent Messages */}
        <div className="panel">
          <div className="panel-header">
            <span>✉ Recent Messages</span>
            <Link href="/admin/messages" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          {messagesData.length === 0 ? (
            <div className="panel-body text-center text-muted">No messages yet</div>
          ) : (
            <table className="cf-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {messagesData.slice(0, 5).map((msg) => (
                  <tr key={msg.id}>
                    <td style={{ fontWeight: msg.isRead ? 400 : 700 }}>{msg.name}</td>
                    <td style={{ fontWeight: msg.isRead ? 400 : 700 }}>{msg.subject || "(No subject)"}</td>
                    <td className="text-center">
                      {msg.isRead ? (
                        <span className="text-muted" style={{ fontSize: "var(--font-size-xs)" }}>Read</span>
                      ) : (
                        <span className="unread-badge">New</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="panel">
          <div className="panel-header">
            <span>⚡ Quick Actions</span>
          </div>
          <div className="panel-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <Link href="/admin/profile" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                👤 Edit Profile
              </Link>
              <Link href="/admin/projects" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                📁 Manage Projects
              </Link>
              <Link href="/admin/skills" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                💻 Manage Skills
              </Link>
              <Link href="/admin/experience" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                💼 Manage Experience
              </Link>
              <Link href="/admin/messages" className="btn btn-secondary" style={{ justifyContent: "flex-start" }}>
                ✉ View Messages {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {profileData && (
        <div className="panel mt-lg">
          <div className="panel-header">
            <span>👤 Profile Summary</span>
            <Link href="/admin/profile" className="btn btn-sm btn-primary">Edit</Link>
          </div>
          <div className="panel-body">
            <table className="cf-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, width: "150px" }}>Name</td>
                  <td>{profileData.fullName}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Title</td>
                  <td>{profileData.title}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Handle</td>
                  <td className="text-mono">{profileData.handle}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Rating</td>
                  <td className="text-mono">{profileData.rating}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Rank</td>
                  <td style={{ textTransform: "capitalize" }}>{profileData.rank}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
