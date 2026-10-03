import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, BadgeCheck, IdCard, Users, MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";
import useTr from "../../i18n/useTr";

export default function JobCard({ job }) {
    const { tr } = useTr();
    const [saved, setSaved] = useState(false);

    return (
        <article className="group flex flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-navy-900">
            {/* top row */}
            <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-navy-900">
                    <img src={job.img} alt="" onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-paper px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        {job.badge}
                    </span>
                    <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-navy-900">{job.title}</h3>
                    <p className="mt-1 flex items-center gap-1 truncate text-sm font-medium text-slate-500">
                        <span className="truncate">{job.company}</span>
                        <BadgeCheck size={14} className="shrink-0 text-brand-dark" />
                    </p>
                </div>
                <button onClick={() => setSaved(!saved)} aria-label="Save job"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition hover:border-navy-900">
                    <Heart size={16} className={saved ? "fill-red-500 text-red-500" : "text-navy-900"} />
                </button>
            </div>

            {/* salary */}
            <div className="mt-5 flex items-end justify-between gap-3 rounded-lg bg-paper px-4 py-3">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{tr("Monthly Compensation")}</p>
                    <p className="mt-0.5 font-display text-xl font-extrabold text-navy-900">
                        {String(job.salary ?? "").replace("/ mo", tr("/ mo"))}
                    </p>
                </div>
                {job.vacancies > 0 && (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
                        <Users size={12} className="text-brand" /> {job.vacancies} {tr("Vacancies")}
                    </span>
                )}
            </div>

            {/* facts */}
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 text-[13px] text-slate-600">
                <span className="flex min-w-0 items-center gap-1.5">
                    <MapPin size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{job.location}</span>
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                    <Clock size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{job.shift}</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <Briefcase size={14} className="shrink-0 text-slate-400" /> {job.exp}
                </span>
                <span className="flex items-center gap-1.5">
                    <IdCard size={14} className="shrink-0 text-slate-400" /> {tr(job.emp || "Full-time")}
                </span>
            </div>

            <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{job.desc}</p>

            {/* footer */}
            <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{job.posted}</span>
                <Link to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2.5 text-xs font-bold text-white transition group-hover:bg-brand group-hover:text-navy-900">
                    {tr("View Job")} <ArrowUpRight size={14} />
                </Link>
            </div>
        </article>
    );
}