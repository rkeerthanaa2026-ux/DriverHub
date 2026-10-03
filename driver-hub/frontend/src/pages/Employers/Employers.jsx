import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Search, RefreshCw, Compass, Building2, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import ComboBox from "../../components/ComboBox/ComboBox";
import { employers, E_STATES, E_DISTRICTS, E_CITIES, E_PINS } from "../../data/employersData";
import useTr from "../../i18n/useTr";

const EMPTY = { state: "", district: "", city: "", pin: "" };

export default function Employers() {
    const { tr } = useTr();
    const [q, setQ] = useState("");
    const [loc, setLoc] = useState(EMPTY);
    const [spin, setSpin] = useState(false);

    const set = (k, v) => setLoc((p) => ({ ...p, [k]: v }));

    const refresh = () => {
        setSpin(true);
        setQ("");
        setLoc(EMPTY);
        setTimeout(() => setSpin(false), 700);
    };

    const list = useMemo(() => {
        const has = (s, t) => s.toLowerCase().includes(t.toLowerCase());
        return employers.filter((e) => {
            if (q && !has(`${e.name} ${e.industry} ${e.tag} ${e.city}`, q)) return false;
            if (loc.state && !has(e.state, loc.state)) return false;
            if (loc.district && !has(e.district, loc.district)) return false;
            if (loc.city && !has(`${e.city} ${e.area}`, loc.city)) return false;
            if (loc.pin && !e.pin.startsWith(loc.pin)) return false;
            return true;
        });
    }, [q, loc]);

    // the location filter stays in English, same as the reference site
    const fields = [
        ["1. State / Union Territory", "state", E_STATES, "Type or select State / UT (All India)"],
        ["2. District", "district", E_DISTRICTS, "Type any District across India"],
        ["3. Town / City / Locality", "city", E_CITIES, "Type town, city, hub or post office"],
        ["4. PIN Code", "pin", E_PINS, "Type 6-digit PIN or select..."],
    ];

    return (
        <div className="container-x py-10">
            <section className="rounded-[32px] bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-8 text-white lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px]">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide text-brand">
                            <Sparkles size={15} /> {tr("Verified Employer Directory")}
                        </span>
                        <h1 className="mt-5 text-4xl font-extrabold tracking-tight lg:text-5xl">{tr("Top Logistics & Fleet Partners")}</h1>
                        <p className="mt-4 max-w-2xl text-lg text-slate-200">
                            {tr("Explore verified transport companies, corporate fleets, and schools hiring drivers directly.")}
                        </p>
                    </div>

                    <div>
                        <div className="flex h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4">
                            <Search size={16} className="text-slate-300" />
                            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr("Search company, industry...")}
                                className="w-full bg-transparent text-white outline-none placeholder:text-slate-300" />
                        </div>
                        <div className="mt-4 flex items-center justify-between px-1 text-sm">
                            <button onClick={refresh} className="inline-flex items-center gap-2 font-semibold text-slate-100 hover:text-white">
                                <RefreshCw size={15} className={spin ? "animate-spin" : ""} /> {tr("Refresh directory")}
                            </button>
                            <span className="font-bold text-brand">{list.length} Fleets</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 flex items-center gap-2 font-sans text-base font-extrabold uppercase tracking-wide">
                    <Compass size={18} className="text-brand" /> Pan-India Location Filter (Type to search or select)
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {fields.map(([label, key, opts, ph]) => (
                        <div key={key}>
                            <label className="mb-2 block text-sm font-extrabold uppercase tracking-wide">{label}</label>
                            <ComboBox value={loc[key]} onChange={(v) => set(key, v)} options={opts} placeholder={ph} />
                        </div>
                    ))}
                </div>
            </section>

            {list.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
                    <h3 className="text-2xl font-bold">{tr("No employers match your search")}</h3>
                    <p className="mt-2 text-slate-500">{tr("Try clearing the filters or click Refresh directory.")}</p>
                </div>
            ) : (
                <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((e) => (
                        <article key={e.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                            <div className="relative h-40 bg-gradient-to-br from-navy-900 to-navy-700">
                                <img src={e.img} alt={e.name} onError={(ev) => (ev.currentTarget.style.display = "none")} className="h-full w-full object-cover" />
                                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700">
                                    <ShieldCheck size={14} /> {tr("Verified Partner")}
                                </span>
                                <span className="absolute bottom-3 right-3 rounded-lg bg-navy-900/90 px-3 py-1 text-xs font-bold text-white">{e.tag}</span>
                            </div>

                            <div className="relative px-6 pb-6">
                                <div className="-mt-9 mb-4 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-400 shadow-md">
                                    <Building2 size={30} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-sans text-xl font-extrabold text-navy-900">{e.name}</h3>
                                <p className="mt-1 text-slate-500">{e.industry}</p>

                                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 py-5 text-slate-600">
                                    <MapPin size={17} className="shrink-0 text-slate-400" />
                                    <span>{e.area}</span>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                                        {e.vacancies} {tr("Open Vacancies")}
                                    </span>
                                    <Link to={`/jobs?q=${encodeURIComponent(e.jobCompany)}`}
                                        className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
                                        {tr("View Jobs")} <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}