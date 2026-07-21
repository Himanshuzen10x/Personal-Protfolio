import { getExperience } from "@/lib/actions";
import AdminExperienceClient from "@/components/AdminExperienceClient";

export default async function AdminExperiencePage() {
  const experienceData = await getExperience();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Experience</h1>
          <p className="admin-subtitle">Add, edit, or remove work experience entries</p>
        </div>
      </div>
      <AdminExperienceClient experiences={experienceData} />
    </div>
  );
}
