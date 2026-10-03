import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Truck, Building2, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthShell from "../../components/AuthShell/AuthShell";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";

const TABS = {
    driver: {
        label: "Driver", icon: Truck, title: "Sign In to Driver Hub",
        sub: "Access your driver account, employer dashboard, or fleet tools.",
        placeholder: "driver@example.com", button: "Sign In as Driver",
    },
    employer: {
        label: "Employer", icon: Building2, title: "Sign In to Driver Hub",
        sub: "Access your driver account, employer dashboard, or fleet tools.",
        placeholder: "employer@fleet.com", button: "Sign In as Employer",
    },
    admin: {
        label: "Admin", icon: ShieldCheck, title: "Admin Portal Sign In",
        sub: "Authorized platform administration, job moderation & verification.",
        placeholder: "admin@driverhub.in", button: "Sign In as Superadmin",
    },
};

const HOME_AFTER_LOGIN = { driver: "/", employer: "/", admin: "/" };

const label = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500";
const inputWrap =
    "flex h-12 items-center gap-3 rounded-lg border border-line bg-paper px-4 focus-within:border-navy-900 focus-within:bg-white";

export default function Login() {
    const { tr } = useTr();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [tab, setTab] = useState("driver");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");

    const t = TABS[tab];

    const switchTab = (k) => { setTab(k); setError(""); };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(tab, email, password);
            navigate(params.get("redirect") || HOME_AFTER_LOGIN[tab]);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AuthShell>
            <h1 className="mt-8 text-4xl font-extrabold text-navy-900 lg:mt-0">{tr(t.title)}</h1>
            <p className="mt-3 text-lg text-slate-600">{tr(t.sub)}</p>

            <div className="mt-8 grid grid-cols-3 gap-1 rounded-xl bg-paper p-1">
                {Object.entries(TABS).map(([k, v]) => {
                    const active = tab === k;
                    return (
                        <button key={k} type="button" onClick={() => switchTab(k)}
                            className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${active ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
                                }`}>
                            <v.icon size={16} className={active ? "text-brand" : "text-slate-400"} /> {tr(v.label)}
                        </button>
                    );
                })}
            </div>

            <form onSubmit={submit} className="mt-6">
                <label className={label}>{tr("Email Address")}</label>
                <div className={inputWrap}>
                    <Mail size={17} className="text-slate-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                </div>

                <div className="mb-2 mt-5 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{tr("Password")}</label>
                    <button type="button" className="text-sm font-bold text-brand-dark hover:underline">{tr("Forgot?")}</button>
                </div>
                <div className={inputWrap}>
                    <Lock size={17} className="text-slate-400" />
                    <input type={show ? "text" : "password"} required minLength={6} value={password}
                        onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShow((s) => !s)} className="text-slate-400 hover:text-slate-700">
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

                <button type="submit"
                    className="mt-6 h-12 w-full rounded-lg bg-navy-900 text-base font-bold text-white transition hover:bg-navy-800">
                    {tr(t.button)}
                </button>
            </form>

            <p className="mt-6 border-t border-line pt-5 text-center text-slate-500">
                {tr("Don't have an account?")}{" "}
                <Link to={`/register?role=${tab === "employer" ? "employer" : "driver"}`} className="font-bold text-brand-dark hover:underline">
                    {tr("Create an Account")}
                </Link>
            </p>
        </AuthShell>
    );
}