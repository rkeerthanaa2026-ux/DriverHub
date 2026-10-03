import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useTr from "../../i18n/useTr";

const CARDS = [
    {
        tag: "License Review", emoji: "🪪", title: "License documents reviewed", img: "/images/license.svg",
        text: "Upload your driving license for review. A verification badge appears after an administrator approves it.",
        link: "Upload License", to: "/register?role=driver"
    },
    {
        tag: "Salary Details", emoji: "💵", title: "Compare Driver Job Salaries", img: "/images/salary.svg",
        text: "Salary and benefits vary by employer and vacancy. Check the details on each active job listing.",
        link: "Browse All Jobs", to: "/jobs"
    },
    {
        tag: "Fleet Operators", emoji: "🚛", title: "Verified Fleet Employers", img: "/images/mass-truck.jpg",
        text: "Explore verified employers and see their active vacancies.",
        link: "Top Employers", to: "/employers"
    },
    {
        tag: "Real-Time Alerts", emoji: "🏢", title: "Application Updates", img: "/images/alerts.svg",
        text: "Check your account notifications for updates supported by your current account settings.",
        link: "Register", to: "/register"
    },
    {
        tag: "Corporate Driver Hiring", emoji: "🚗", title: "Corporate & Executive Sedans", img: "/images/sedan.svg",
        text: "Browse chauffeur openings and review each employer's requirements and pay details.",
        link: "Find Jobs", to: "/jobs"
    },
    {
        tag: "Direct Hiring", emoji: "🤝", title: "Zero Middlemen", img: "/images/auth-driver.jpg",
        text: "Browse verified employers and review each job listing for its pay and hiring details.",
        link: "Explore Openings", to: "/jobs"
    },
];

function Card({ c, clone }) {
    const { tr } = useTr();
    return (
        <Link
            to={c.to}
            tabIndex={clone ? -1 : undefined}
            aria-hidden={clone ? true : undefined}
            className="group mr-4 block w-[78vw] shrink-0 overflow-hidden rounded-xl border border-line bg-white transition hover:border-navy-900 sm:w-72"
        >
            <div className="relative h-24 bg-navy-900">
                <img src={c.img} alt="" onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-full w-full object-cover opacity-80" />
                <span className="absolute bottom-2 left-2 rounded-md bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900">
                    {tr(c.tag)}
                </span>
            </div>
            <div className="p-4">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-navy-900">
                    <span className="text-lg">{c.emoji}</span> {tr(c.title)}
                </h3>
                <p className="mt-2 min-h-[36px] text-xs leading-relaxed text-slate-500 line-clamp-2">{tr(c.text)}</p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-xs font-bold text-brand-dark">
                    {tr(c.link)} <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}

export default function FeatureCards() {
    return (
        <section className="overflow-hidden border-y border-line bg-white/60 py-8">
            <div className="dh-marquee pl-4">
                {CARDS.map((c) => <Card key={c.title} c={c} />)}
                {CARDS.map((c) => <Card key={`${c.title}-clone`} c={c} clone />)}
            </div>
        </section>
    );
}