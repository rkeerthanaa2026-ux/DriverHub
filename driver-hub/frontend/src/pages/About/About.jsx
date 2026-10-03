import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck, Award, Truck, CheckCircle2 } from "lucide-react";
import useTr from "../../i18n/useTr";

const CARDS = [
    {
        icon: ShieldCheck, tile: "bg-amber-50 text-amber-600",
        title: "License documents reviewed",
        text: "Upload your driving license for review. A verification badge appears after an administrator approves it.",
    },
    {
        icon: Award, tile: "bg-emerald-50 text-emerald-600",
        title: "Zero Commission",
        text: "Browse verified employers and review each job listing for its pay and hiring details.",
    },
    {
        icon: Truck, tile: "bg-blue-50 text-blue-600",
        title: "Direct Hiring",
        text: "Driver Hub connects drivers and employers through job listings, applications, and profile verification tools. Check each listing and account status for current details.",
    },
];

const SAFETY = [
    {
        title: "For Drivers",
        points: ["License and document review by an administrator", "Clear salary, shift and location on every listing", "No agency fee or commission charged"],
    },
    {
        title: "For Employers",
        points: ["Verified partner badge after profile review", "Direct access to applicant profiles", "Shortlist and contact candidates in one place"],
    },
];

export default function About() {
    const { tr } = useTr();
    const { hash } = useLocation();

    // footer link "About Safety & Welfare" -> /about#safety
    useEffect(() => {
        if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0 });
    }, [hash]);

    return (
        <div className="container-x py-14">
            {/* Intro */}
            <section className="mx-auto max-w-5xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-wide text-navy-900 shadow-sm">
                    <Sparkles size={15} className="text-brand" /> {tr("Driver Recruitment & Fleet Hiring")}
                </span>
                <h1 className="mt-8 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl lg:text-[64px]">
                    {tr("Empowering Commercial Drivers & Connecting Fleet Leaders")}
                </h1>
                <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-600">
                    {tr("Driver Hub connects drivers and employers through job listings, applications, and profile verification tools. Check each listing and account status for current details.")}
                </p>
            </section>

            {/* 3 cards */}
            <section className="mt-16 grid gap-7 md:grid-cols-3">
                {CARDS.map((c) => (
                    <article key={c.title} className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                        <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-2xl ${c.tile}`}>
                            <c.icon size={28} />
                        </div>
                        <h3 className="mt-7 text-2xl font-extrabold text-navy-900">{tr(c.title)}</h3>
                        <p className="mt-5 text-lg leading-relaxed text-slate-600">{tr(c.text)}</p>
                    </article>
                ))}
            </section>

            {/* Safety & Welfare */}
            <section id="safety" className="mt-20 scroll-mt-28 rounded-[32px] bg-navy-950 p-8 text-white sm:p-14">
                <span className="inline-block rounded-lg bg-navy-800 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-brand">
                    {tr("About Safety & Welfare")}
                </span>
                <h2 className="mt-6 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {tr("Fair hiring and safe working conditions for every driver")}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-slate-300">
                    {tr("Employers are reviewed before they hire on Driver Hub, and every listing shows pay, shifts and requirements up front.")}
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {SAFETY.map((b) => (
                        <div key={b.title} className="rounded-2xl border border-white/10 bg-navy-900/70 p-7">
                            <h3 className="text-xl font-extrabold">{tr(b.title)}</h3>
                            <ul className="mt-4 space-y-3 text-slate-300">
                                {b.points.map((p) => (
                                    <li key={p} className="flex items-start gap-3">
                                        <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-brand" /> {tr(p)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                    <Link to="/jobs" className="rounded-xl bg-brand px-8 py-4 text-lg font-extrabold text-navy-900 transition hover:brightness-95">
                        {tr("Explore Openings")}
                    </Link>
                    <Link to="/contact" className="rounded-xl border border-white/15 bg-navy-800 px-8 py-4 text-lg font-extrabold text-white transition hover:bg-navy-700">
                        {tr("Contact")}
                    </Link>
                </div>
            </section>
        </div>
    );
}