import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Truck, Building2, Eye, EyeOff, Compass, ShieldCheck, RotateCcw } from "lucide-react";
import AuthShell from "../../components/AuthShell/AuthShell";
import ComboBox from "../../components/ComboBox/ComboBox";
import { useAuth } from "../../context/AuthContext";
import { LOCATIONS } from "../../data/locationData";
import { CATEGORIES } from "../../data/jobsData";
import useTr from "../../i18n/useTr";

const DEFAULT_LOC = { state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru (GPO / MG Road)", pin: "560001" };
const EMPTY_LOC = { state: "", district: "", city: "", pin: "" };

const input =
    "h-12 w-full rounded-lg border border-line bg-paper px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-navy-900 focus:bg-white";
const label = "mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500";

export default function Register() {
    const { tr } = useTr();
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const { register } = useAuth();

    const role = params.get("role") === "employer" ? "employer" : "driver";
    const setRole = (r) => { setParams({ role: r }, { replace: true }); setError(""); };

    const [f, setF] = useState({ name: "", license: "", years: "", company: "", contact: "", industry: "", email: "", phone: "", password: "" });
    const [loc, setLoc] = useState(DEFAULT_LOC);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");

    const upd = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

    const states = Object.keys(LOCATIONS);
    const districts = useMemo(() => Object.keys(LOCATIONS[loc.state] || {}), [loc.state]);
    const cities = useMemo(() => Object.keys(LOCATIONS[loc.state]?.[loc.district] || {}), [loc.state, loc.district]);
    const pins = useMemo(() => LOCATIONS[loc.state]?.[loc.district]?.[loc.city] || [], [loc.state, loc.district, loc.city]);

    const setLevel = (key, value) =>
        setLoc((p) => {
            if (key === "state") return { state: value, district: "", city: "", pin: "" };
            if (key === "district") return { ...p, district: value, city: "", pin: "" };
            if (key === "city") return { ...p, city: value, pin: "" };
            return { ...p, pin: value };
        });

    const submit = async (e) => {
        e.preventDefault();
        if (!pins.includes(loc.pin)) {
            setError("Please choose a valid State, District, Town and PIN code from the lists.");
            return;
        }
        try {
            const base = { email: f.email, phone: f.phone, password: f.password, location: loc };
            await register(
                role === "driver"
                    ? { ...base, role: "candidate", name: f.name, licenseType: f.license, experienceYears: Number(f.years) }
                    : { ...base, role: "employer", name: f.contact, companyName: f.company, industry: f.industry }
            );
            navigate(params.get("redirect") || "/");
        } catch (err) {
            setError(err.message);
        }
    };

    const tabCls = (active) =>
        `flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${active ? "bg-navy-900 text-white" : "text-slate-600 hover:text-navy-900"
        }`;

    return (
        <AuthShell maxW="max-w-[1320px]">
            <h1 className="mt-8 text-4xl font-extrabold text-navy-900 lg:mt-0">{tr("Create an Account")}</h1>
            <p className="mt-3 text-lg text-slate-600">{tr("Join Driver Hub to apply for verified driver jobs or hire commercial pilots.")}</p>

            <div className="mt-7 grid grid-cols-2 gap-1 rounded-xl bg-paper p-1">
                <button type="button" onClick={() => setRole("driver")} className={tabCls(role === "driver")}>
                    <Truck size={17} className={role === "driver" ? "text-brand" : "text-slate-400"} /> {tr("Continue as Driver")}
                </button>
                <button type="button" onClick={() => setRole("employer")} className={tabCls(role === "employer")}>
                    <Building2 size={17} className={role === "employer" ? "text-brand" : "text-slate-400"} /> {tr("Continue as Employer")}
                </button>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-5">
                {role === "driver" ? (
                    <>
                        <div>
                            <label className={label}>{tr("Full Name")}</label>
                            <input required className={input} placeholder="e.g. Ramesh Gowda" value={f.name} onChange={upd("name")} />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={label}>{tr("Driver License / Vehicle Category")}</label>
                                <select required className={input} value={f.license} onChange={upd("license")}>
                                    <option value="">{tr("Select your license category")}</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{tr(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={label}>Years (Experience)</label>
                                <input required type="number" min="0" max="50" className={input} value={f.years} onChange={upd("years")} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className={label}>{tr("Company / Fleet Name")}</label>
                            <input required className={input} placeholder="e.g. Apex Express Logistics" value={f.company} onChange={upd("company")} />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className={label}>{tr("Contact Person")}</label>
                                <input required className={input} placeholder="e.g. Priya Sharma" value={f.contact} onChange={upd("contact")} />
                            </div>
                            <div>
                                <label className={label}>{tr("Industry Sector")}</label>
                                <input required className={input} placeholder="e.g. E-commerce Logistics" value={f.industry} onChange={upd("industry")} />
                            </div>
                        </div>
                    </>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className={label}>{tr("Email Address")}</label>
                        <input required type="email" className={input} placeholder="name@domain.com" value={f.email} onChange={upd("email")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Phone Number")}</label>
                        <input required type="tel" pattern="[+0-9 ]{10,15}" title="Enter a valid phone number" className={input}
                            placeholder="+91 98765 00000" value={f.phone} onChange={upd("phone")} />
                    </div>
                </div>

                <div>
                    <label className={label}>{tr("Password")}</label>
                    <div className="relative">
                        <input required minLength={6} type={show ? "text" : "password"} className={`${input} pr-12`}
                            placeholder="••••••••" value={f.password} onChange={upd("password")} />
                        <button type="button" onClick={() => setShow((s) => !s)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Location hierarchy stays in English, same as before */}
                <div className="border-t border-line pt-5">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-navy-900">
                        <Compass size={17} className="text-brand-dark" /> Pan-India Location Hierarchy (Type to search or select)
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-xs font-bold text-brand-dark">
                            <ShieldCheck size={14} /> India Post PIN Directory Active
                        </span>
                        <button type="button" onClick={() => setLoc(EMPTY_LOC)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy-900">
                            <RotateCcw size={14} /> Clear Location
                        </button>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={label}>1. State / Union Territory <span className="text-red-500">*</span></label>
                            <ComboBox compact clearable value={loc.state} onChange={(v) => setLevel("state", v)} options={states} placeholder="Type or select State / UT" />
                        </div>
                        <div>
                            <label className={label}>2. District <span className="text-red-500">*</span></label>
                            <ComboBox compact clearable value={loc.district} onChange={(v) => setLevel("district", v)} options={districts} placeholder="Type or select District" />
                        </div>
                        <div>
                            <label className={label}>3. Town / City / Locality <span className="text-red-500">*</span></label>
                            <ComboBox compact clearable value={loc.city} onChange={(v) => setLevel("city", v)} options={cities} placeholder="Type or select Town / City" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label className={label}>4. PIN Code <span className="text-red-500">*</span></label>
                                {pins.length > 0 && <span className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-brand-dark">{pins.length} PINS AVAILABLE</span>}
                            </div>
                            <ComboBox compact clearable value={loc.pin} onChange={(v) => setLevel("pin", v)} options={pins} placeholder="Type or select PIN" />
                        </div>
                    </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

                <button type="submit" className="h-12 w-full rounded-lg bg-navy-900 text-base font-bold text-white transition hover:bg-navy-800">
                    {role === "driver" ? tr("Register as Driver") : tr("Register as Employer")}
                </button>
            </form>

            <p className="mt-6 border-t border-line pt-5 text-center text-slate-500">
                {tr("Already have an account?")}{" "}
                <Link to="/login" className="font-bold text-brand-dark hover:underline">{tr("Sign In")}</Link>
            </p>
        </AuthShell>
    );
}