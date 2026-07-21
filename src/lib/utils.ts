export function getRankClass(rank: string): string {
  const normalized = rank.toLowerCase().replace(/\s+/g, "-");
  const mapping: Record<string, string> = {
    newbie: "rank-newbie",
    pupil: "rank-pupil",
    specialist: "rank-specialist",
    expert: "rank-expert",
    "candidate-master": "rank-candidate-master",
    "candidate master": "rank-candidate-master",
    master: "rank-master",
    "international-master": "rank-international-master",
    "international master": "rank-international-master",
    grandmaster: "rank-grandmaster",
    "international-grandmaster": "rank-international-grandmaster",
    "international grandmaster": "rank-international-grandmaster",
    "legendary-grandmaster": "rank-legendary-grandmaster",
    "legendary grandmaster": "rank-legendary-grandmaster",
  };
  return mapping[normalized] || mapping[rank] || "rank-newbie";
}

export function getProficiencyColor(proficiency: number): string {
  if (proficiency >= 90) return "prof-red";
  if (proficiency >= 80) return "prof-orange";
  if (proficiency >= 70) return "prof-violet";
  if (proficiency >= 60) return "prof-blue";
  if (proficiency >= 50) return "prof-cyan";
  if (proficiency >= 40) return "prof-green";
  return "prof-gray";
}

export function getStatusClass(status: string): string {
  const mapping: Record<string, string> = {
    completed: "status-completed",
    "in-progress": "status-in-progress",
    archived: "status-archived",
  };
  return mapping[status] || "status-archived";
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function formatFullDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getRatingFromProficiency(proficiency: number): number {
  // Map 0-100 proficiency to CF-style rating range
  return Math.round((proficiency / 100) * 3000);
}
