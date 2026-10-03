import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, IndianRupee, Zap, ArrowRight, ArrowUpRight, BadgeCheck, Building2 } from "lucide-react";
import SearchBar from "../../components/SearchBar/SearchBar";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import JobCard from "../../components/JobCard/JobCard";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import { categories, jobs, employers } from "../../data/homeData";
import { allJobs } from "../../data/jobsData";
import useTr from "../../i18n/useTr";

// Static for now. In the backend phase these come from GET /api/stats
const stats = { drivers: 17, employers: 9, jobs: 95, hires: 0 };

const HERO_SUB =
    "Connecting verified commercial and personal drivers directly with top logistics fleets, corporate employers, and private vehicle owners. Direct hiring, verified licenses, zero agency cuts.";

const CHIPS = [
    [CheckCircle2, "Direct Hiring"],
    [ShieldCheck, "License documents reviewed"],
    [IndianRupee, "Salary shown on each job listing"],
    [Zap, "Zero Commission"],
];

function SectionHead({ kicker, title, to, link }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark">{kicker}</p>
                <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
            </div>
            {to && (
                <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 hover:text-brand-dark">
                    {link} <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

export default function Home() {
    const { tr } = useTr();

    const statList = [
        [stats.drivers, "Verified Drivers"],
        [stats.employers, "Fleet & Corporate Employers"],
        [stats.jobs, "Active Job Openings"],
        [stats.hires, "Successful Hires"],
    ];

    return (
        <>
            {/* Hero */}
            <section className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
                <div>
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-900">
                        <span className="h-2 w-2 rounded-full bg-brand" /> {tr("Driver Recruitment & Fleet Hiring")}
                    </span>

                    <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-[68px]">
                        {tr("Drive Your Career Forward with")}{" "}
                        <span className="relative whitespace-nowrap text-brand-dark">Driver Hub</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{tr(HERO_SUB)}</p>

                    <ul className="mt-8 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
                        {CHIPS.map(([Icon, text]) => (
                            <li key={text} className="flex items-start gap-2.5 text-sm font-semibold text-navy-900">
                                <Icon size={18} className="mt-0.5 shrink-0 text-brand-dark" /> {tr(text)}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 max-w-xl"><SearchBar /></div>
                </div>

                <div className="relative">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-navy-900">
                        <img src="/images/mass-truck.jpg" alt="" onError={(e) => (e.currentTarget.style.display = "none")}
                            className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute bottom-4 left-4 rounded-xl border border-line bg-white p-4 shadow-lg">
                        <p className="font-display text-4xl font-extrabold text-navy-900">{stats.jobs}</p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-brand" /> {tr("Active Job Openings")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats strip */}
            <section className="container-x">
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
                    {statList.map(([n, label]) => (
                        <div key={label} className="bg-white p-6 sm:p-8">
                            <div className="font-display text-5xl font-extrabold text-navy-900">{n}</div>
                            <div className="mt-2 text-sm font-semibold text-slate-500">{tr(label)}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-14"><FeatureCards /></div>

            {/* Specializations */}
            <section className="container-x py-20">
                <SectionHead
                    kicker={tr("Explore by vehicle & license category")}
                    title={tr("Popular Driving Specializations")}
                    to="/jobs" link={tr("Browse All Jobs")}
                />
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((c) => <CategoryCard key={c.title} c={c} />)}
                </div>
            </section>

            {/* Featured jobs */}
            <section className="container-x pb-20">
                <SectionHead
                    kicker={tr("Active & Verified")}
                    title={tr("Featured Driver Openings")}
                    to="/jobs" link={`${tr("View All")} ${allJobs.length} ${tr("Jobs")}`}
                />
                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((j) => <JobCard key={j.id} job={j} />)}
                </div>
            </section>

            {/* Top employers */}
            <section className="container-x pb-20">
                <SectionHead
                    kicker={tr("Verified Partner")}
                    title={tr("Trusted by Leading Fleets & Enterprises")}
                    to="/employers" link={tr("Top Employers")}
                />
                <p className="mt-5 max-w-xl text-slate-500">
                    {tr("Explore verified transport companies, corporate fleets, and schools hiring drivers directly.")}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {employers.map((e) => (
                        <Link key={e.name} to={`/jobs?q=${encodeURIComponent(e.name)}`}
                            className="group flex items-center gap-4 rounded-xl border border-line bg-white p-5 transition hover:border-navy-900">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-paper text-navy-900">
                                <Building2 size={22} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-[15px] font-bold">{e.name}</h3>
                                <p className="truncate text-sm text-slate-500">{e.industry}</p>
                                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-dark">
                                    <BadgeCheck size={13} /> {tr("Verified Partner")}
                                </span>
                            </div>
                            <ArrowUpRight size={18} className="shrink-0 text-slate-300 transition group-hover:text-navy-900" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container-x pb-10">
                <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-navy-950 p-10 text-white lg:flex-row lg:items-center lg:p-14">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-extrabold">{tr("Ready to Hire or Start Driving Today?")}</h2>
                        <p className="mt-4 text-lg leading-8 text-slate-300">{tr(HERO_SUB)}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-extrabold text-navy-900 transition hover:brightness-95">
                            {tr("Find Jobs")} <ArrowUpRight size={18} />
                        </Link>
                        <Link to="/employers/post-job" className="rounded-full border border-white/25 px-8 py-4 text-base font-bold transition hover:bg-white/10">
                            {tr("Post Driver Vacancy")}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}