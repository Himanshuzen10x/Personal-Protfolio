"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions";

interface ProfileFormProps {
  profile: {
    id: number;
    fullName: string;
    title: string | null;
    bio: string | null;
    handle: string | null;
    rating: number | null;
    rank: string | null;
    location: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
  } | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    try {
      await updateProfile(formData);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form action={handleSubmit} className="cf-form">
      {status === "saved" && (
        <div className="alert alert-success">✓ Profile updated successfully!</div>
      )}
      {status === "error" && (
        <div className="alert alert-error">Failed to update profile.</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
        <div className="form-group">
          <label htmlFor="profile-fullName" className="form-label">Full Name</label>
          <input type="text" id="profile-fullName" name="fullName" className="form-input" defaultValue={profile?.fullName || ""} required />
        </div>
        <div className="form-group">
          <label htmlFor="profile-title" className="form-label">Title</label>
          <input type="text" id="profile-title" name="title" className="form-input" defaultValue={profile?.title || ""} placeholder="e.g. Full Stack Developer" />
        </div>
        <div className="form-group">
          <label htmlFor="profile-handle" className="form-label">Handle</label>
          <input type="text" id="profile-handle" name="handle" className="form-input" defaultValue={profile?.handle || ""} placeholder="CF-style handle" />
        </div>
        <div className="form-group">
          <label htmlFor="profile-location" className="form-label">Location</label>
          <input type="text" id="profile-location" name="location" className="form-input" defaultValue={profile?.location || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-rating" className="form-label">Rating</label>
          <input type="number" id="profile-rating" name="rating" className="form-input" defaultValue={profile?.rating || 0} min="0" max="4000" />
        </div>
        <div className="form-group">
          <label htmlFor="profile-rank" className="form-label">Rank</label>
          <select id="profile-rank" name="rank" className="form-select" defaultValue={profile?.rank || "newbie"}>
            <option value="newbie">Newbie</option>
            <option value="pupil">Pupil</option>
            <option value="specialist">Specialist</option>
            <option value="expert">Expert</option>
            <option value="candidate master">Candidate Master</option>
            <option value="master">Master</option>
            <option value="international master">International Master</option>
            <option value="grandmaster">Grandmaster</option>
            <option value="international grandmaster">International Grandmaster</option>
            <option value="legendary grandmaster">Legendary Grandmaster</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="profile-bio" className="form-label">Bio</label>
        <textarea id="profile-bio" name="bio" className="form-textarea" rows={4} defaultValue={profile?.bio || ""} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
        <div className="form-group">
          <label htmlFor="profile-githubUrl" className="form-label">GitHub URL</label>
          <input type="url" id="profile-githubUrl" name="githubUrl" className="form-input" defaultValue={profile?.githubUrl || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-linkedinUrl" className="form-label">LinkedIn URL</label>
          <input type="url" id="profile-linkedinUrl" name="linkedinUrl" className="form-input" defaultValue={profile?.linkedinUrl || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="profile-resumeUrl" className="form-label">Resume URL</label>
          <input type="url" id="profile-resumeUrl" name="resumeUrl" className="form-input" defaultValue={profile?.resumeUrl || ""} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
        {status === "saving" ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
