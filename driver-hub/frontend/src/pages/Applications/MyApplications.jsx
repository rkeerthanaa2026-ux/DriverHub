import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { MapPin, IndianRupee, Calendar, Check, Briefcase } from "lucide-react";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";
import { STEPS, LABEL, BADGE } from "./status";

function Tracker({ status }) {
    const { tr } = useTr();
    if (status === "rejected") {
        return <p className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600">{tr("Not Selected")}</p>;
    }
    const current = STEPS.indexOf(status);
    return (
        <ol className="flex items-start">
            {STEPS.map((s, i) => (
                <li key={s} className={`flex items-start ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                    <div className="flex w-20 flex-col items-center text-center">
                        <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= current ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {i < current ? <Check size={16} /> : i + 1}
                        </span>
                        <span className={`mt-2 text-xs font-semibold ${i <= current ? "text-navy-900" : "text-slate-400"}`}>{tr(LABEL[s])}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <span className={`mt-4 h-0.5 flex-1 ${i < current ? "bg-emerald-500" : "bg-slate-200"}`} />
                    )}
                </li>
            ))}
        </ol>
    );
}

export default function MyApplications() {
    const { tr, isKn } = useTr();
    const { user, loading } = useAuth();
    const [apps, setApps] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.role !== "candidate") return;
        api("/applications/mine").then((d) => setApps(d.applications)).catch((e) => setError(e.message));
    }, [user]);

    if (loading) return null;
    if (!user) return <Navigate to="/login?redirect=/applications" replace />;
    if (user.role !== "candidate") {
        return <div className="container-x py-24 text-center text-lg text-slate-600">{tr("Only driver accounts have applications.")}</div>;
    }

    const withdraw = async (id) => {
        if (!window.confirm(tr("Withdraw this application?"))) return;
        try {
            await api(`/applications/${id}`, { method: "DELETE" });
            setApps((list) => list.filter((a) => a.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };

    const date = (d) => new Date(d).toLocaleDateString(isKn ? "kn-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <div className="container-x py-12">
            <h1 className="text-4xl font-extrabold text-navy-900">{tr("My Applications")}</h1>
            <p className="mt-3 text-lg text-slate-600">{tr("Track the status of every job you have applied for.")}</p>
            {apps && <p className="mt-2 font-bold text-brand-dark">{tr("Total")}: {apps.length}</p>}

            {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

            {apps && apps.length === 0 && (
                <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
                    <Briefcase className="mx-auto text-slate-300" size={40} />
                    <p className="mt-4 text-xl font-bold">{tr("You have not applied for any jobs yet.")}</p>
                    <Link to="/jobs" className="mt-6 inline-block rounded-xl bg-brand px-8 py-3 font-extrabold text-navy-900">{tr("Find Jobs")}</Link>
                </div>
            )}

            <div className="mt-10 space-y-6">
                {apps?.map((a) => (
                    <article key={a.id} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-navy-900">{a.job.title}</h2>
                                <p className="mt-1 font-semibold text-slate-600">{a.job.company}</p>
                                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {a.job.city}</span>
                                    <span className="inline-flex items-center gap-1.5"><IndianRupee size={15} /> {(a.job.salary || "").replace("/ mo", tr("/ mo"))}</span>
                                    <span className="inline-flex items-center gap-1.5"><Calendar size={15} /> {tr("Applied on")} {date(a.createdAt)}</span>
                                </div>
                            </div>
                            <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${BADGE[a.status]}`}>{tr(LABEL[a.status])}</span>
                        </div>

                        <div className="mt-7 overflow-x-auto"><Tracker status={a.status} /></div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                            <Link to={`/jobs/${a.jobId}`} className="font-bold text-blue-700 hover:underline">{tr("View Job")}</Link>
                            {a.status !== "hired" && (
                                <button onClick={() => withdraw(a.id)} className="text-sm font-bold text-red-600 hover:underline">{tr("Withdraw")}</button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}