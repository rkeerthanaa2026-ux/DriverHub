import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, Briefcase, Users, UserCheck, Award, MapPin, Phone, Mail, Trash2, BadgeCheck } from "lucide-react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";
import { ALL_STATUSES, LABEL, BADGE } from "../Applications/status";

function Stat({ icon: Icon, value, label, tone }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon size={22} /></span>
            <p className="mt-4 text-3xl font-extrabold text-navy-900">{value}</p>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
        </div>
    );
}

function DriverCard({ a, onStatus, showSelect = true, isKn }) {
    const { tr } = useTr();
    const c = a.candidate || {};
    const hiredAt = a.history?.filter((h) => h.status === "hired").pop()?.at;
    const date = (d) => new Date(d).toLocaleDateString(isKn ? "kn-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-900 text-lg font-extrabold text-brand">
                        {(c.name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div>
                        <p className="text-lg font-extrabold text-navy-900">{c.name || "—"}</p>
                        <p className="text-sm text-slate-500">{tr("Applied for")}: <span className="font-semibold text-slate-700">{a.job.title}</span></p>
                    </div>
                </div>
                {showSelect ? (
                    <select value={a.status} onChange={(e) => onStatus(a.id, e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-brand">
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{tr(LABEL[s])}</option>)}
                    </select>
                ) : (
                    <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${BADGE.hired}`}>
                        {tr("Hired")}{hiredAt ? ` · ${date(hiredAt)}` : ""}
                    </span>
                )}
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-2 hover:text-brand-dark"><Phone size={15} className="text-slate-400" /> {c.phone || "—"}</a>
                <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 break-all hover:text-brand-dark"><Mail size={15} className="text-slate-400" /> {c.email}</a>
                <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-slate-400" /> {tr(c.licenseType || "—")}</span>
                <span className="inline-flex items-center gap-2"><Briefcase size={15} className="text-slate-400" /> {c.experienceYears ?? 0} {tr("Years")}</span>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={15} className="text-slate-400" /> {[c.location?.city, c.location?.district, c.location?.state, c.location?.pin].filter(Boolean).join(", ")}
            </p>
            {a.coverNote && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">“{a.coverNote}”</p>}
        </article>
    );
}

export default function EmployerDashboard() {
    const { tr, isKn } = useTr();
    const { user, loading } = useAuth();
    const [jobs, setJobs] = useState(null);
    const [apps, setApps] = useState([]);
    const [tab, setTab] = useState("jobs");
    const [jobFilter, setJobFilter] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.role !== "employer") return;
        Promise.all([api("/jobs/mine"), api("/applications/employer")])
            .then(([j, a]) => { setJobs(j.jobs); setApps(a.applications); })
            .catch((e) => setError(e.message));
    }, [user]);

    const stats = useMemo(() => ({
        open: (jobs || []).filter((j) => j.status === "open").length,
        applicants: apps.length,
        inProcess: apps.filter((a) => ["shortlisted", "interview"].includes(a.status)).length,
        hired: apps.filter((a) => a.status === "hired").length,
    }), [jobs, apps]);

    if (loading) return null;
    if (!user) return <Navigate to="/login?redirect=/employers/dashboard" replace />;
    if (user.role !== "employer") {
        return <div className="container-x py-24 text-center text-lg text-slate-600">{tr("Only employer accounts have a dashboard.")}</div>;
    }

    const toggle = async (job) => {
        const status = job.status === "open" ? "closed" : "open";
        try {
            await api(`/jobs/${job.id}/status`, { method: "PATCH", body: { status } });
            setJobs((l) => l.map((j) => (j.id === job.id ? { ...j, status } : j)));
        } catch (e) { setError(e.message); }
    };

    const remove = async (job) => {
        if (!window.confirm(tr("Delete this job posting?"))) return;
        try {
            await api(`/jobs/${job.id}`, { method: "DELETE" });
            setJobs((l) => l.filter((j) => j.id !== job.id));
        } catch (e) { setError(e.message); }
    };

    const changeStatus = async (id, status) => {
        try {
            await api(`/applications/${id}/status`, { method: "PATCH", body: { status } });
            setApps((l) => l.map((a) => (a.id === id ? { ...a, status } : a)));
        } catch (e) { setError(e.message); }
    };

    const tabCls = (t) =>
        `rounded-xl px-5 py-2.5 text-sm font-bold transition ${tab === t ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-slate-100"}`;

    const shownApps = jobFilter ? apps.filter((a) => a.jobId === jobFilter) : apps;
    const hired = apps.filter((a) => a.status === "hired");

    return (
        <div className="container-x py-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-navy-900">{tr("Employer Dashboard")}</h1>
                    <p className="mt-2 text-lg text-slate-600">{user.companyName || user.name}</p>
                </div>
                <Link to="/employers/post-job" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-extrabold text-navy-900 hover:brightness-95">
                    <Plus size={18} /> {tr("Post a Job")}
                </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Stat icon={Briefcase} value={stats.open} label={tr("Active Job Openings")} tone="bg-amber-50 text-amber-600" />
                <Stat icon={Users} value={stats.applicants} label={tr("Total Applicants")} tone="bg-blue-50 text-blue-600" />
                <Stat icon={UserCheck} value={stats.inProcess} label={tr("In Process")} tone="bg-violet-50 text-violet-600" />
                <Stat icon={Award} value={stats.hired} label={tr("Recruited Drivers")} tone="bg-emerald-50 text-emerald-600" />
            </div>

            {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

            <div className="mt-10 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 sm:w-fit">
                <button onClick={() => setTab("jobs")} className={tabCls("jobs")}>{tr("My Job Postings")}</button>
                <button onClick={() => setTab("applicants")} className={tabCls("applicants")}>{tr("Applicants")} ({apps.length})</button>
                <button onClick={() => setTab("hired")} className={tabCls("hired")}>{tr("Recruited Drivers")} ({hired.length})</button>
            </div>

            {/* My postings */}
            {tab === "jobs" && (
                <div className="mt-6 space-y-4">
                    {jobs?.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
                            <p className="text-xl font-bold">{tr("You have not posted any jobs yet.")}</p>
                            <Link to="/employers/post-job" className="mt-5 inline-block rounded-xl bg-brand px-8 py-3 font-extrabold text-navy-900">{tr("Post a Job")}</Link>
                        </div>
                    )}
                    {jobs?.map((j) => (
                        <article key={j.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-extrabold text-navy-900">{j.title}</h3>
                                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${j.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                        {j.status === "open" ? tr("Open") : tr("Closed")}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                    {tr(j.cat)} · {j.city} · {j.salary?.replace("/ mo", tr("/ mo"))} · {j.vacancies} {tr("Vacancies")}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-blue-700">{j.applicants} {tr("Applicants")}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link to={`/jobs/${j.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">{tr("View Job")}</Link>
                                <button onClick={() => { setJobFilter(j.id); setTab("applicants"); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">{tr("Applicants")}</button>
                                <button onClick={() => toggle(j)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50">
                                    {j.status === "open" ? tr("Close") : tr("Reopen")}
                                </button>
                                <button onClick={() => remove(j)} aria-label="Delete" className="rounded-xl p-2.5 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Applicants */}
            {tab === "applicants" && (
                <div className="mt-6">
                    <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-brand">
                        <option value="">{tr("All Jobs")}</option>
                        {jobs?.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                    <div className="mt-5 space-y-4">
                        {shownApps.length === 0 && <p className="rounded-2xl bg-white p-10 text-center text-slate-500">{tr("No applicants yet.")}</p>}
                        {shownApps.map((a) => <DriverCard key={a.id} a={a} onStatus={changeStatus} isKn={isKn} />)}
                    </div>
                </div>
            )}

            {/* Recruited */}
            {tab === "hired" && (
                <div className="mt-6 space-y-4">
                    {hired.length === 0 && <p className="rounded-2xl bg-white p-10 text-center text-slate-500">{tr("No drivers recruited yet. Set an applicant to Hired to see them here.")}</p>}
                    {hired.map((a) => <DriverCard key={a.id} a={a} showSelect={false} isKn={isKn} />)}
                </div>
            )}
        </div>
    );
}