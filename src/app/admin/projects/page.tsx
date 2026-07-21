import { getProjects } from "@/lib/actions";
import AdminProjectsClient from "@/components/AdminProjectsClient";

export default async function AdminProjectsPage() {
  const projectsData = await getProjects();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Projects</h1>
          <p className="admin-subtitle">Add, edit, or remove portfolio projects</p>
        </div>
      </div>
      <AdminProjectsClient projects={projectsData} />
    </div>
  );
}
