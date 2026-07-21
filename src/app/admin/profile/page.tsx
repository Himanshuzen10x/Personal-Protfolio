import { getProfile } from "@/lib/actions";
import ProfileForm from "@/components/ProfileForm";

export default async function AdminProfilePage() {
  const profileData = await getProfile();

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Edit Profile</h1>
          <p className="admin-subtitle">Update your personal information and links</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>👤 Profile Information</span>
        </div>
        <div className="panel-body">
          <ProfileForm profile={profileData} />
        </div>
      </div>
    </div>
  );
}
