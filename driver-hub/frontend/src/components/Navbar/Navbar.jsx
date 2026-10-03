import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ClipboardList, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import LogoMark from "../LogoMark/LogoMark";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";
import { useTranslation } from "react-i18next";

const links = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Jobs" },
    { to: "/employers", label: "Top Employers" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

const ROLE_LABEL = { candidate: "Driver Account", employer: "Employer Account", admin: "Admin Account" };

const LANGS = [["en", "EN"], ["kn", "ಕನ್ನಡ"]];

export default function Navbar() {
    const { i18n } = useTranslation();
    const { tr, isKn } = useTr();
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState(false);
    const menuRef = useRef(null);

    const appLinks =
        user?.role === "candidate" ? [["/applications", "My Applications", ClipboardList]]
            : user?.role === "admin" ? [["/admin/applications", "Manage Applications", ClipboardList]]
                : user?.role === "employer"
                    ? [["/employers/dashboard", "Employer Dashboard", LayoutDashboard], ["/employers/post-job", "Post a Job", PlusCircle]]
                    : [];

    useEffect(() => {
        const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const setLang = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem("lang", code);
    };

    const signOut = async () => {
        await logout();
        setOpen(false);
        setMenu(false);
        navigate("/");
    };

    const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

    const LangSwitch = () => (
        <div className="flex rounded-full border border-line bg-white p-0.5 text-xs font-bold">
            {LANGS.map(([code, text]) => (
                <button key={code} type="button" onClick={() => setLang(code)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${(code === "kn") === isKn ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
                        }`}>
                    {text}
                </button>
            ))}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
            <div className="container-x flex h-[68px] items-center justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-navy-900">
                        <LogoMark size={40} />
                    </span>
                    <span className="leading-none">
                        <span className="block whitespace-nowrap font-display text-[19px] font-extrabold tracking-tight text-navy-900">
                            DRIVER<span className="text-brand-dark">HUB</span>
                        </span>
                        <span className="mt-1 hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 2xl:block">
                            {tr("Professional Recruitment Network")}
                        </span>
                    </span>
                </Link>

                {/* Desktop links */}
                <nav className="hidden items-center gap-1 xl:flex">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.to === "/"}
                            className={({ isActive }) =>
                                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-white hover:text-navy-900"
                                }`
                            }>
                            {tr(l.label)}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop right side */}
                <div className="hidden shrink-0 items-center gap-3 xl:flex">
                    <LangSwitch />

                    {!loading && (user ? (
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenu((m) => !m)}
                                className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 transition hover:border-navy-900">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-navy-900">{initial}</span>
                                <span className="max-w-[110px] truncate text-sm font-bold text-navy-900">{user.name}</span>
                                <ChevronDown size={15} className={`text-slate-500 transition ${menu ? "rotate-180" : ""}`} />
                            </button>

                            {menu && (
                                <div className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-xl border border-line bg-white p-2 shadow-lg">
                                    <div className="border-b border-line px-3 pb-3 pt-2">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{tr("Signed in as")}</p>
                                        <p className="mt-1 truncate font-extrabold text-navy-900">{user.name}</p>
                                        <p className="truncate text-sm text-slate-500">{user.email}</p>
                                        <span className="mt-2 inline-block rounded-md bg-navy-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                                            {tr(ROLE_LABEL[user.role] || "Driver Account")}
                                        </span>
                                    </div>
                                    {appLinks.map(([to, text, Icon]) => (
                                        <Link key={to} to={to} onClick={() => setMenu(false)}
                                            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy-900 hover:bg-paper">
                                            <Icon size={17} className="text-brand-dark" /> {tr(text)}
                                        </Link>
                                    ))}
                                    <button onClick={signOut}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                                        <LogOut size={17} /> {tr("Sign Out")}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="whitespace-nowrap px-2 text-sm font-bold text-navy-900 hover:text-brand-dark">
                                {tr("Sign In")}
                            </Link>
                            <Link to="/register" className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-navy-900 transition hover:brightness-95">
                                {tr("Register")}
                            </Link>
                        </>
                    ))}
                </div>

                {/* Mobile / tablet button */}
                <button className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile / tablet menu */}
            {open && (
                <div className="space-y-1 border-t border-line bg-paper px-4 py-4 xl:hidden">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-3 text-sm font-semibold ${isActive ? "bg-navy-900 text-white" : "text-navy-900 hover:bg-white"}`
                            }>
                            {tr(l.label)}
                        </NavLink>
                    ))}
                    {appLinks.map(([to, text]) => (
                        <NavLink key={to} to={to} onClick={() => setOpen(false)}
                            className="block rounded-lg px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-white">
                            {tr(text)}
                        </NavLink>
                    ))}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                        <LangSwitch />
                        {!loading && (user ? (
                            <>
                                <span className="max-w-[140px] truncate text-sm font-bold text-navy-900">{user.name}</span>
                                <button onClick={signOut} className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">
                                    {tr("Sign Out")}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">{tr("Sign In")}</Link>
                                <Link to="/register" onClick={() => setOpen(false)} className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-navy-900">{tr("Register")}</Link>
                            </>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}