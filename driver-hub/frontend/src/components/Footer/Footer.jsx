import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, Award, ArrowUpRight } from "lucide-react";
import LogoMark from "../LogoMark/LogoMark";
import useTr from "../../i18n/useTr";

const ABOUT =
    "Connecting verified commercial and personal drivers directly with top logistics fleets, corporate employers, and private vehicle owners. Direct hiring, verified licenses, zero agency cuts.";

const CATEGORY_LINKS = [
    ["Heavy Truck (HMV)", "/jobs?category=HMV Driver"],
    ["Personal & Sedan Chauffeur", "/jobs?category=Personal Driver"],
    ["App-based Cab Driver", "/jobs?category=Cab Driver"],
    ["Hyperlocal Delivery Pilot", "/jobs?category=Delivery Driver"],
    ["School & Staff Bus Driver", "/jobs?category=Bus Driver"],
    ["40ft Container Trailer Driver", "/jobs?category=Trailer Driver"],
];

const PORTAL_LINKS = [
    ["Search All Vacancies", "/jobs"],
    ["Verified Companies", "/employers"],
    ["Post Driver Vacancy", "/employers/post-job"],
    ["Join as a Candidate", "/register?role=driver"],
    ["Employer Sign In", "/login"],
    ["Staff & Admin Portal", "/login", true],
    ["About Safety & Welfare", "/about#safety"],
];

const linkCls = "text-[15px] text-slate-400 transition hover:text-white";
const headCls = "text-[11px] font-bold uppercase tracking-[0.16em] text-brand";

export default function Footer() {
    const { tr } = useTr();

    return (
        <footer className="mt-10 bg-navy-950 text-white">
            <div className="container-x pt-16">
                {/* Top band */}
                <div className="grid items-end gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_1fr]">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-3">
                            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-navy-800">
                                <LogoMark size={48} />
                            </span>
                            <span className="font-display text-2xl font-extrabold tracking-tight">
                                DRIVER<span className="text-brand">HUB</span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{tr(ABOUT)}</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-slate-200">
                                <ShieldCheck size={14} className="text-brand" /> {tr("License verification available")}
                            </span>
                            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-slate-200">
                                <Award size={14} className="text-brand" /> {tr("Direct Employer Hiring")}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                        <Link to="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-extrabold text-navy-900 transition hover:brightness-95">
                            {tr("Find Jobs")} <ArrowUpRight size={18} />
                        </Link>
                        <Link to="/employers/post-job" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-bold transition hover:bg-white/10">
                            {tr("Post a Job")}
                        </Link>
                    </div>
                </div>

                {/* Links */}
                <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <h4 className={headCls}>{tr("Driver Categories")}</h4>
                        <ul className="mt-6 space-y-3.5">
                            {CATEGORY_LINKS.map(([label, to]) => (
                                <li key={label}><Link to={to} className={linkCls}>{tr(label)}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={headCls}>{tr("Recruitment Portals")}</h4>
                        <ul className="mt-6 space-y-3.5">
                            {PORTAL_LINKS.map(([label, to, accent]) => (
                                <li key={label}>
                                    <Link to={to}
                                        className={accent
                                            ? "inline-flex items-center gap-2 text-[15px] font-bold text-brand transition hover:brightness-110"
                                            : linkCls}>
                                        {accent && <ShieldCheck size={16} />} {tr(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={headCls}>{tr("Support Desk")}</h4>
                        <ul className="mt-6 space-y-4 text-[15px] text-slate-300">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                                <span>{tr("Electronic City Phase 1, Bengaluru, Karnataka - 560100")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="shrink-0 text-brand" />
                                <a href="tel:+918022008899" className="transition hover:text-white">+91 80 2200 8899</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="shrink-0 text-brand" />
                                <a href="mailto:support@driverhub.in" className="break-all transition hover:text-white">support@driverhub.in</a>
                            </li>
                        </ul>
                        <p className="mt-5 text-sm text-slate-500">{tr("Mon - Sat: 9:00 AM - 7:00 PM IST")}</p>
                    </div>
                </div>

                {/* Bottom bar: extra bottom padding keeps the chat button off the links */}
                <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pb-20 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center">
                    <p>{tr("© 2026 Driver Hub Inc. All rights reserved.")}</p>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 sm:pr-72">
                        <Link to="/contact" className="transition hover:text-white">{tr("Privacy Policy")}</Link>
                        <Link to="/contact" className="transition hover:text-white">{tr("Terms of Service")}</Link>
                        <Link to="/about#safety" className="transition hover:text-white">{tr("Driver Welfare")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}