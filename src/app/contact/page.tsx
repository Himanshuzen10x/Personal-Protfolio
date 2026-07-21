"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitContactForm(formData);
      if (result.error) {
        setStatus("error");
        setErrorMsg(result.error);
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="page-full">
      <div className="breadcrumbs">
        <a href="/">Home</a>
        <span>»</span>
        <strong>Contact</strong>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="panel">
          <div className="panel-header">
            <span>✉ Send a Message</span>
          </div>
          <div className="panel-body">
            {status === "success" ? (
              <div className="alert alert-success">
                <strong>✓ Message sent successfully!</strong>
                <p style={{ marginTop: "var(--space-sm)" }}>
                  Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
                <button
                  className="btn btn-secondary mt-md"
                  onClick={() => setStatus("idle")}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form action={handleSubmit} className="cf-form">
                {status === "error" && (
                  <div className="alert alert-error">{errorMsg}</div>
                )}

                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    Name <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="form-input"
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    Email <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="form-input"
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    className="form-input"
                    placeholder="What is this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    Message <span style={{ color: "var(--accent-red)" }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-textarea"
                    required
                    rows={6}
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <div className="panel">
            <div className="panel-header">
              <span>📋 Contact Information</span>
            </div>
            <div className="panel-body">
              <ul className="contact-info-list">
                <li>
                  <span className="contact-info-icon">📧</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>Email</div>
                    <a href="mailto:admin@portfolio.dev">admin@portfolio.dev</a>
                  </div>
                </li>
                <li>
                  <span className="contact-info-icon">📍</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>Location</div>
                    <span>India</span>
                  </div>
                </li>
                <li>
                  <span className="contact-info-icon">⟨/⟩</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>GitHub</div>
                    <a href="https://github.com/himanshuzen10x" target="_blank" rel="noopener noreferrer">
                      github.com/himanshuzen10x
                    </a>
                  </div>
                </li>
                <li>
                  <span className="contact-info-icon">🔗</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>LinkedIn</div>
                    <a href="https://linkedin.com/in/himanshu-kumar" target="_blank" rel="noopener noreferrer">
                      linkedin.com/in/himanshu-kumar
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span>⏰ Availability</span>
            </div>
            <div className="panel-body">
              <ul className="sidebar-list">
                <li>
                  <span className="sidebar-list-label">Status</span>
                  <span style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: "var(--font-size-sm)" }}>
                    ● Available
                  </span>
                </li>
                <li>
                  <span className="sidebar-list-label">Response Time</span>
                  <span className="sidebar-list-value">~24 hrs</span>
                </li>
                <li>
                  <span className="sidebar-list-label">Open to</span>
                  <span className="sidebar-list-value">Full-time, Freelance</span>
                </li>
                <li>
                  <span className="sidebar-list-label">Timezone</span>
                  <span className="sidebar-list-value">IST (UTC+5:30)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
