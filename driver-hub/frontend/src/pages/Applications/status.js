export const STEPS = ["applied", "reviewing", "shortlisted", "interview", "hired"];
export const ALL_STATUSES = [...STEPS, "rejected"];

export const LABEL = {
    applied: "Applied",
    reviewing: "Under Review",
    shortlisted: "Shortlisted",
    interview: "Interview",
    hired: "Hired",
    rejected: "Not Selected",
};

export const BADGE = {
    applied: "bg-blue-50 text-blue-700",
    reviewing: "bg-amber-50 text-amber-700",
    shortlisted: "bg-violet-50 text-violet-700",
    interview: "bg-cyan-50 text-cyan-700",
    hired: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
};