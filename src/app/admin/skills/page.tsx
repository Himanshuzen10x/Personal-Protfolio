import { getSkills } from "@/lib/actions";
import AdminSkillsClient from "@/components/AdminSkillsClient";

export default async function AdminSkillsPage() {
  const skillsData = await getSkills();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Manage Skills</h1>
          <p className="admin-subtitle">Add, edit, or remove your technical skills</p>
        </div>
      </div>
      <AdminSkillsClient skills={skillsData} />
    </div>
  );
}
