import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, ArrowRight, Sparkles, Building2, ShieldCheck, BadgeCheck, IndianRupee,
    MapPin, Briefcase, Clock, CheckCircle2, FileText, Users,
} from "lucide-react";
import { allJobs } from "../../data/jobsData";
import { getJobDetail, getSimilarJobs } from "../../data/jobDetailData";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { toJobShape } from "../../api/jobs";
import useTr from "../../i18n/useTr";

function InfoCol({ label, icon: Icon, children, iconClass = "text-slate-400" }) {
    return (
        <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-bold text-navy-900">
                <Icon size={18} className={`shrink-0 ${iconClass}`} />
                <span className="truncate">{children}</span>
            </p>
        </div>
    );
}

export default function JobDetail() {
    const { tr } = useTr();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // seeded job, or an employer-posted job fetched from the API
    const staticJob = allJobs.find((j) => String(j.id) === id);
    const [dbJob, setDbJob] = useState(null);
    const [dbLoading, setDbLoading] = useState(!staticJob);
    const job = staticJob || dbJob;

    const [myApp, setMyApp] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [note, setNote] = useState("");
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState("");

    useEffect(() => {
        if (staticJob) return;
        setDbLoading(true);
        api(`/jobs/${id}`)
            .then((d) => setDbJob(toJobShape(d.job)))
            .catch(() => setDbJob(null))
            .finally(() => setDbLoading(false));
    }, [id]);

    useEffect(() => {
        setMyApp(null);
        if (user?.role !== "candidate") return;
        api("/applications/mine")
            .then((d) => setMyApp(d.applications.find((a) => String(a.jobId) === String(id)) || null))
            .catch(() => { });
    }, [user, id]);

    useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);

    const years = (s) => String(s ?? "").replace(/Years?/i, tr("Years"));
    const perMonth = (s) => String(s ?? "").replace("/ mo", tr("/ mo"));

    if (!job && dbLoading) return null;

    if (!job) {
        return (
            <div className="container-x py-24 text-center">
                <h1 className="text-3xl font-extrabold">{tr("Job not found")}</h1>
                <p className="mt-2 text-slate-500">{tr("This vacancy may have been closed or removed.")}</p>
                <Link to="/jobs" className="mt-6 inline-block rounded-xl bg-navy-900 px-6 py-3 font-bold text-white">
                    {tr("Browse all jobs")}
                </Link>
            </div>
        );
    }

    const d = job.custom ? job.detail : getJobDetail(job);
    const similar = job.custom ? allJobs.filter((j) => j.cat === job.cat).slice(0, 3) : getSimilarJobs(job);

    const submitApplication = async () => {
        setApplying(true);
        setApplyError("");
        try {
            const res = await api("/applications", {
                method: "POST",
                body: {
                    jobId: job.id,
                    coverNote: note,
                    job: {
                        title: job.title, company: job.company, city: job.city,
                        location: job.location, salary: job.salary, category: job.cat, img: job.img,
                    },
                },
            });
            setMyApp(res.application);
            setShowForm(false);
            setNote("");
        } catch (e) {
            setApplyError(e.message);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="container-x py-8">
            <button
                onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/jobs"))}
                className="inline-flex items-center gap-2 font-bold text-navy-900 hover:text-brand"
            >
                <ArrowLeft size={18} /> {tr("Back to Search Results")}
            </button>

            {/* Header card */}
            <section className="mt-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <div className="relative h-48 bg-gradient-to-br from-navy-900 to-navy-700 sm:h-60">
                    <img src={job.img} alt={job.title} onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-lg bg-navy-900/90 px-3.5 py-2 text-sm font-bold text-brand">
                        <Sparkles size={15} /> {tr(job.cat)}
                    </span>
                </div>

                <div className="px-6 pb-8 sm:px-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        <div className="-mt-12 flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-lg">
                            <Building2 size={44} strokeWidth={1.4} />
                        </div>

                        <div className="flex-1 pt-1 md:pt-5">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-bold text-blue-700">{tr(job.cat)}</span>
                                <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-bold text-slate-600">{tr(job.emp || "Full-time")}</span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-bold text-emerald-700">
                                    <BadgeCheck size={15} /> {tr("Active & Verified")}
                                </span>
                            </div>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">{job.title}</h1>
                            <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-slate-600">
                                {job.company} <ShieldCheck size={18} className="text-blue-600" />
                            </p>
                        </div>

                        {/* Sign In / Apply Now / Applied */}
                        <div className="md:pt-5">
                            {loading ? null : !user ? (
                                <Link
                                    to={`/login?redirect=/jobs/${job.id}`}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-lg font-extrabold text-navy-900 shadow-md transition hover:brightness-95"
                                >
                                    {tr("Sign In")} <ArrowRight size={18} />
                                </Link>
                            ) : user.role !== "candidate" ? (
                                <p className="max-w-[220px] rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                                    {tr("Only driver accounts can apply for jobs.")}
                                </p>
                            ) : myApp ? (
                                <div className="flex flex-col items-start gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-lg font-extrabold text-emerald-700">
                                        <CheckCircle2 size={20} /> {tr("Applied")}
                                    </span>
                                    <Link to="/applications" className="font-bold text-blue-700 hover:underline">
                                        {tr("Track Application")} →
                                    </Link>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-lg font-extrabold text-navy-900 shadow-md transition hover:brightness-95"
                                >
                                    {tr("Apply Now")} <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 border-t border-slate-100 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCol label={tr("Monthly Compensation")} icon={IndianRupee} iconClass="text-emerald-600">{perMonth(job.salary)}</InfoCol>
                        <InfoCol label={tr("Job Location")} icon={MapPin} iconClass="text-slate-400">{job.location}</InfoCol>
                        <InfoCol label={tr("Experience Required")} icon={Briefcase}>{years(job.exp)}</InfoCol>
                        <InfoCol label={tr("Working Shifts")} icon={Clock}>{tr(job.shift)}</InfoCol>
                    </div>
                </div>
            </section>

            {/* Body */}
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_480px]">
                {/* Left */}
                <div className="space-y-8">
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
                        <h2 className="text-2xl font-extrabold text-navy-900">{tr("Job Description & Duties")}</h2>
                        <p className="mt-6 text-lg leading-relaxed text-slate-600">{tr(job.desc)}</p>
                        <p className="mt-6 text-lg text-slate-600">{tr("Benefits:")}</p>
                        <ul className="mt-1 space-y-1 text-lg text-slate-600">
                            {d.benefits.map((b) => <li key={b}>• {tr(b)}</li>)}
                        </ul>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
                        <h2 className="text-2xl font-extrabold text-navy-900">{tr("Required Skills & Qualifications")}</h2>
                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {d.skills.map((s) => (
                                <div key={s} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 font-semibold text-navy-900">
                                    <CheckCircle2 size={20} className="shrink-0 text-emerald-600" /> {tr(s)}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
                        <h2 className="text-2xl font-extrabold text-navy-900">{tr("Mandatory Verification Documents")}</h2>
                        <p className="mt-4 text-slate-600">{tr("Candidates must carry original copies during the final interview / driving test:")}</p>
                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {d.docs.map((doc) => (
                                <div key={doc} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3.5 font-semibold text-navy-900">
                                    <FileText size={20} className="shrink-0 text-brand" /> {tr(doc)}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right */}
                <aside className="space-y-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-7">
                        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">{tr("About the Employer")}</h3>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
                                <Building2 size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-lg font-extrabold text-navy-900">{d.employer.name}</p>
                                <p className="text-slate-500">{d.employer.place}</p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 font-medium text-slate-600">
                            <p className="flex items-center gap-2.5"><ShieldCheck size={18} className="text-emerald-600" /> {tr("Verified Employer")}</p>
                            <p className="flex items-center gap-2.5"><Users size={18} className="text-blue-600" /> {d.employer.vacancies} {tr("Vacancies")}</p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-7">
                        <h3 className="flex items-center gap-2.5 text-lg font-extrabold text-navy-900">
                            <Sparkles size={18} className="text-brand" /> {tr("Driver Safety & Welfare Standard")}
                        </h3>
                        <p className="mt-4 leading-relaxed text-blue-900/70">
                            {tr("Driver Hub strictly audits employers to guarantee timely monthly salary deposits, vehicle roadworthiness, and accident insurance coverage.")}
                        </p>
                    </section>

                    <section>
                        <h3 className="mb-4 text-lg font-extrabold text-navy-900">{tr("Similar Driver Openings")}</h3>
                        <div className="space-y-4">
                            {similar.map((s) => (
                                <Link key={s.id} to={`/jobs/${s.id}`}
                                    className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                                    <p className="font-extrabold text-navy-900">{s.title}</p>
                                    <p className="mt-2 text-sm text-slate-500">{s.company} • {s.city}</p>
                                    <p className="mt-3 font-bold text-emerald-600">{perMonth(s.salary)}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>

            {/* Apply popup */}
            {showForm && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
                    <div className="w-full max-w-lg rounded-3xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-extrabold text-navy-900">{tr("Apply for this job")}</h3>
                        <p className="mt-1 text-slate-500">{job.title} • {job.company}</p>
                        <textarea
                            rows={4}
                            maxLength={500}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={tr("Add a short note for the employer (optional)")}
                            className="mt-5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:bg-white"
                        />
                        {applyError && (
                            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(applyError)}</p>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowForm(false)}
                                className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50">
                                {tr("Cancel")}
                            </button>
                            <button onClick={submitApplication} disabled={applying}
                                className="rounded-xl bg-navy-900 px-6 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60">
                                {applying ? tr("Submitting...") : tr("Submit Application")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}