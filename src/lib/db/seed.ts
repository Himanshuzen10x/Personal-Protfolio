import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import bcrypt from "bcryptjs";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "portfolio.db");
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      full_name TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      avatar_url TEXT,
      handle TEXT,
      rating INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'newbie',
      location TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      resume_url TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      name TEXT NOT NULL,
      category TEXT,
      proficiency INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      tech_stack TEXT,
      live_url TEXT,
      github_url TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'completed',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      location TEXT,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field TEXT,
      start_year INTEGER,
      end_year INTEGER,
      gpa TEXT,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tables created");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  
  const existingUser = sqlite.prepare("SELECT id FROM users WHERE username = ?").get("admin");
  
  let userId: number;
  if (!existingUser) {
    const result = sqlite.prepare(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"
    ).run("admin", "admin@portfolio.dev", passwordHash);
    userId = result.lastInsertRowid as number;
    console.log("✅ Admin user created (username: admin, password: admin123)");
  } else {
    userId = (existingUser as { id: number }).id;
    console.log("ℹ️  Admin user already exists");
  }

  // Seed profile
  const existingProfile = sqlite.prepare("SELECT id FROM profile WHERE user_id = ?").get(userId);
  if (!existingProfile) {
    sqlite.prepare(`
      INSERT INTO profile (user_id, full_name, title, bio, handle, rating, rank, location, github_url, linkedin_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      "Himanshu Kumar",
      "Full Stack Developer",
      "Passionate software developer with expertise in building scalable web applications. Experienced in modern JavaScript frameworks, backend systems, and cloud technologies. I love solving complex problems and contributing to open-source projects. Currently focused on building performant, accessible web experiences.",
      "himanshu_dev",
      1842,
      "candidate master",
      "India",
      "https://github.com/himanshuzen10x",
      "https://linkedin.com/in/himanshu-kumar"
    );
    console.log("✅ Profile seeded");
  }

  // Seed skills
  const existingSkills = sqlite.prepare("SELECT COUNT(*) as count FROM skills").get() as { count: number };
  if (existingSkills.count === 0) {
    const skillsData = [
      // Languages
      { name: "JavaScript", category: "Language", proficiency: 92, order: 1 },
      { name: "TypeScript", category: "Language", proficiency: 88, order: 2 },
      { name: "Python", category: "Language", proficiency: 85, order: 3 },
      { name: "Java", category: "Language", proficiency: 75, order: 4 },
      { name: "C++", category: "Language", proficiency: 70, order: 5 },
      { name: "SQL", category: "Language", proficiency: 82, order: 6 },
      // Frameworks
      { name: "React.js", category: "Framework", proficiency: 90, order: 1 },
      { name: "Next.js", category: "Framework", proficiency: 88, order: 2 },
      { name: "Node.js", category: "Framework", proficiency: 86, order: 3 },
      { name: "Express.js", category: "Framework", proficiency: 84, order: 4 },
      { name: "Django", category: "Framework", proficiency: 72, order: 5 },
      { name: "Spring Boot", category: "Framework", proficiency: 65, order: 6 },
      // Tools & Technologies
      { name: "Git", category: "Tool", proficiency: 90, order: 1 },
      { name: "Docker", category: "Tool", proficiency: 78, order: 2 },
      { name: "AWS", category: "Tool", proficiency: 72, order: 3 },
      { name: "PostgreSQL", category: "Tool", proficiency: 80, order: 4 },
      { name: "MongoDB", category: "Tool", proficiency: 76, order: 5 },
      { name: "Redis", category: "Tool", proficiency: 68, order: 6 },
      { name: "Linux", category: "Tool", proficiency: 82, order: 7 },
      { name: "CI/CD", category: "Tool", proficiency: 74, order: 8 },
    ];

    const insertSkill = sqlite.prepare(
      "INSERT INTO skills (user_id, name, category, proficiency, display_order) VALUES (?, ?, ?, ?, ?)"
    );

    for (const skill of skillsData) {
      insertSkill.run(userId, skill.name, skill.category, skill.proficiency, skill.order);
    }
    console.log("✅ Skills seeded");
  }

  // Seed projects
  const existingProjects = sqlite.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (existingProjects.count === 0) {
    const projectsData = [
      {
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with product catalog, shopping cart, payment integration (Stripe), user authentication, and admin dashboard. Built with microservices architecture for scalability.",
        techStack: "Next.js, TypeScript, PostgreSQL, Stripe, Redis, Docker",
        liveUrl: "https://ecommerce-demo.vercel.app",
        githubUrl: "https://github.com/himanshuzen10x/ecommerce-platform",
        status: "completed",
        featured: 1,
        order: 1,
      },
      {
        title: "Real-Time Chat Application",
        description: "WebSocket-based real-time messaging application supporting private chats, group channels, file sharing, and message encryption. Features typing indicators and online status.",
        techStack: "React, Node.js, Socket.io, MongoDB, JWT, AWS S3",
        liveUrl: "https://chatapp-demo.vercel.app",
        githubUrl: "https://github.com/himanshuzen10x/realtime-chat",
        status: "completed",
        featured: 1,
        order: 2,
      },
      {
        title: "Task Management System",
        description: "Kanban-style project management tool with drag-and-drop task boards, team collaboration, sprint planning, and automated reporting. Integrates with GitHub for issue tracking.",
        techStack: "React, Redux, Express.js, PostgreSQL, GitHub API",
        githubUrl: "https://github.com/himanshuzen10x/task-manager",
        status: "completed",
        featured: 1,
        order: 3,
      },
      {
        title: "AI Content Generator",
        description: "An AI-powered content generation platform that uses GPT APIs to generate blog posts, social media content, and marketing copy. Includes content scheduling and analytics.",
        techStack: "Next.js, OpenAI API, Python, FastAPI, Celery",
        githubUrl: "https://github.com/himanshuzen10x/ai-content-gen",
        status: "completed",
        featured: 0,
        order: 4,
      },
      {
        title: "Weather Dashboard",
        description: "Interactive weather dashboard with 7-day forecasts, interactive maps, severe weather alerts, and historical weather data visualization using D3.js charts.",
        techStack: "React, D3.js, OpenWeatherMap API, Mapbox",
        liveUrl: "https://weather-dash-demo.vercel.app",
        githubUrl: "https://github.com/himanshuzen10x/weather-dashboard",
        status: "completed",
        featured: 0,
        order: 5,
      },
      {
        title: "DevOps Monitoring Tool",
        description: "Server monitoring and alerting system with real-time metrics dashboards, log aggregation, and automated incident response. Currently building notification integrations.",
        techStack: "Go, React, Prometheus, Grafana, Docker, Kubernetes",
        githubUrl: "https://github.com/himanshuzen10x/devops-monitor",
        status: "in-progress",
        featured: 0,
        order: 6,
      },
    ];

    const insertProject = sqlite.prepare(
      "INSERT INTO projects (user_id, title, description, tech_stack, live_url, github_url, status, featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    for (const proj of projectsData) {
      insertProject.run(
        userId, proj.title, proj.description, proj.techStack,
        proj.liveUrl || null, proj.githubUrl, proj.status, proj.featured, proj.order
      );
    }
    console.log("✅ Projects seeded");
  }

  // Seed experience
  const existingExp = sqlite.prepare("SELECT COUNT(*) as count FROM experience").get() as { count: number };
  if (existingExp.count === 0) {
    const expData = [
      {
        company: "TechCorp Solutions",
        role: "Senior Full Stack Developer",
        description: "Lead development of microservices-based e-commerce platform serving 100K+ users. Architected CI/CD pipelines, mentored junior developers, and reduced page load times by 40% through optimization.",
        startDate: "2023-01",
        endDate: null,
        location: "Bangalore, India",
        order: 1,
      },
      {
        company: "StartupXYZ",
        role: "Full Stack Developer",
        description: "Built and deployed 5+ production applications using React and Node.js. Implemented real-time features using WebSockets, integrated third-party APIs, and maintained 99.9% uptime.",
        startDate: "2021-06",
        endDate: "2022-12",
        location: "Remote",
        order: 2,
      },
      {
        company: "Digital Agency Pro",
        role: "Frontend Developer",
        description: "Developed responsive web applications for 15+ clients across various industries. Created reusable component libraries and established frontend coding standards for the team.",
        startDate: "2020-01",
        endDate: "2021-05",
        location: "Mumbai, India",
        order: 3,
      },
      {
        company: "OpenSource Foundation",
        role: "Software Engineering Intern",
        description: "Contributed to open-source projects, fixed critical bugs, implemented new features, and wrote comprehensive documentation. Gained experience with large-scale codebases.",
        startDate: "2019-05",
        endDate: "2019-12",
        location: "Remote",
        order: 4,
      },
    ];

    const insertExp = sqlite.prepare(
      "INSERT INTO experience (user_id, company, role, description, start_date, end_date, location, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    for (const exp of expData) {
      insertExp.run(userId, exp.company, exp.role, exp.description, exp.startDate, exp.endDate, exp.location, exp.order);
    }
    console.log("✅ Experience seeded");
  }

  // Seed education
  const existingEdu = sqlite.prepare("SELECT COUNT(*) as count FROM education").get() as { count: number };
  if (existingEdu.count === 0) {
    const eduData = [
      {
        institution: "Indian Institute of Technology (IIT)",
        degree: "Bachelor of Technology",
        field: "Computer Science & Engineering",
        startYear: 2016,
        endYear: 2020,
        gpa: "8.5/10",
        order: 1,
      },
      {
        institution: "Kendriya Vidyalaya",
        degree: "Higher Secondary (XII)",
        field: "Science (PCM)",
        startYear: 2014,
        endYear: 2016,
        gpa: "94%",
        order: 2,
      },
    ];

    const insertEdu = sqlite.prepare(
      "INSERT INTO education (user_id, institution, degree, field, start_year, end_year, gpa, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    for (const edu of eduData) {
      insertEdu.run(userId, edu.institution, edu.degree, edu.field, edu.startYear, edu.endYear, edu.gpa, edu.order);
    }
    console.log("✅ Education seeded");
  }

  // Seed sample contact messages
  const existingMsgs = sqlite.prepare("SELECT COUNT(*) as count FROM contact_messages").get() as { count: number };
  if (existingMsgs.count === 0) {
    const messagesData = [
      {
        name: "John Smith",
        email: "john@company.com",
        subject: "Job Opportunity - Senior Developer",
        message: "Hi Himanshu, I came across your portfolio and was impressed by your work. We have an exciting opportunity for a Senior Developer role at our company. Would you be interested in discussing this further?",
        isRead: 0,
      },
      {
        name: "Sarah Johnson",
        email: "sarah@startup.io",
        subject: "Freelance Project Inquiry",
        message: "Hello! We are looking for a developer to help us build a SaaS dashboard. Your portfolio projects look amazing. Could we schedule a call to discuss the requirements and timeline?",
        isRead: 0,
      },
      {
        name: "Dev Community",
        email: "events@devconf.org",
        subject: "Speaking Invitation - DevConf 2026",
        message: "We would like to invite you to speak at DevConf 2026 about modern web development practices. Your experience with full-stack development would be valuable to our audience.",
        isRead: 1,
      },
    ];

    const insertMsg = sqlite.prepare(
      "INSERT INTO contact_messages (name, email, subject, message, is_read) VALUES (?, ?, ?, ?, ?)"
    );

    for (const msg of messagesData) {
      insertMsg.run(msg.name, msg.email, msg.subject, msg.message, msg.isRead);
    }
    console.log("✅ Contact messages seeded");
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Admin login: username=admin, password=admin123");
}

seed().catch(console.error);
