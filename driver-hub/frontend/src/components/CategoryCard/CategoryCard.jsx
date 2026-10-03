import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import useTr from "../../i18n/useTr";

export default function CategoryCard({ c }) {
    const { tr } = useTr();
    return (
        <Link
            to={`/jobs?type=${encodeURIComponent(c.type)}`}
            className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-xl bg-navy-900 p-5 text-white transition hover:-translate-y-0.5"
        >
            <img src={c.img} alt="" onError={(e) => (e.currentTarget.style.display = "none")}
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

            <div className="relative flex items-start justify-between">
                <span className="text-2xl">{c.icon}</span>
                <span className="rounded-md border border-white/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {c.badge}
                </span>
            </div>

            <div className="relative">
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-[13px] text-slate-300">{c.desc}</p>
                <div className="mt-4 flex items-end justify-between">
                    <p className="flex items-baseline gap-2">
                        <span className="font-display text-4xl font-extrabold text-brand">{c.count}</span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">{tr("Vacancies")}</span>
                    </p>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition group-hover:bg-brand group-hover:text-navy-900">
                        <ArrowUpRight size={16} />
                    </span>
                </div>
            </div>
        </Link>
    );
}