"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn("credentials", {
        username: formData.get("username"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password.");
        setLoading(false);
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>⟨/⟩ Admin Panel</h1>
          <p>Portfolio Management System</p>
        </div>
        <div className="login-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} className="cf-form">
            <div className="form-group">
              <label htmlFor="login-username" className="form-label">Username</label>
              <input
                type="text"
                id="login-username"
                name="username"
                className="form-input"
                required
                autoComplete="username"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                type="password"
                id="login-password"
                name="password"
                className="form-input"
                required
                autoComplete="current-password"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-lg text-center" style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
            <p>Default credentials: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
