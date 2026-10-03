import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import JobCard from "../../components/JobCard/JobCard";
import ComboBox from "../../components/ComboBox/ComboBox";
import { HUBS, CATEGORIES, SKILLS, EMPLOYMENT, STATES, DISTRICTS, CITIES, PINS } from "../../data/jobsData";
import { useAllJobs } from "../../api/jobs";
import useTr from "../../i18n/useTr";

const PER_PAGE = 6;
const EMPTY = { q: "", hub: "", state: "", district: "", city: "", pin: "", cat: "", skill: "", emp: "", minSalary: 0, loc: "" };

const selectCls =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-slate-800 outline-none focus:border-navy-900";
const lbl = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500";

export default function Jobs() {
    const allJobs = useAllJobs();
    const { tr } = useTr();
    const [params] = useSearchParams();
    const [f, setF] = useState(EMPTY);
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setF({ ...EMPTY, q: params.get("q") || "", cat: params.get("type") || params.get("category") || "", loc: params.get("loc") || "" });
        setPage(1);
    }, [params]);

    const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setPage(1); };

    const filtered = useMemo(() => {
        const has = (s, t) => String(s ?? "").toLowerCase().includes(t.toLowerCase());
        return allJobs
            .filter((j) => {
                if (f.q && !has(`${j.title} ${j.company} ${j.badge} ${j.tag} ${j.desc} ${j.skill}`, f.q)) return false;
                if (f.loc && !has(`${j.location} ${j.city} ${j.district} ${j.state} ${j.pin}`, f.loc)) return false;
                if (f.hub && j.hub !== f.hub) return false;
                if (f.state && !has(j.state, f.state)) return false;
                if (f.district && !has(j.district, f.district)) return false;
                if (f.city && !has(j.city, f.city)) return false;
                if (f.pin && !j.pin.startsWith(f.pin)) return false;
                if (f.cat && j.cat !== f.cat) return false;
                if (f.skill && j.skill !== f.skill) return false;
                if (f.emp && j.emp !== f.emp) return false;
                if (f.minSalary && j.sMin < f.minSalary) return false;
                return true;
            })
            .sort((a, b) => b.posted.localeCompare(a.posted) || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
    }, [f, allJobs]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const current = Math.min(page, pages);
    const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

    const goPage = (n) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

    // location labels stay in English, same as before
    const locationFields = [
        ["1. State / Union Territory", "state", STATES, "Type or select State / UT"],
        ["2. District", "district", DISTRICTS, "Type any District"],
        ["3. Town / City / Locality", "city", CITIES, "Type town, city or hub"],
        ["4. PIN Code", "pin", PINS, "Type or select PIN"],
    ].map(([label, key, opts, ph]) => (
        <div key={key}>
            <label className={lbl}>{label}</label>
            <ComboBox compact value={f[key]} onChange={(v) => set(key, v)} options={opts} placeholder={ph} />
        </div>
    ));

    return (
        <div className="container-x py-10">
            {/* Header */}
            <header className="border-b border-line pb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-dark">
                    {tr("Pan-India Verified Driver Recruitment")}
                </p>
                <h1 className="mt-3 max-w-4xl text-4xl font-extrabold lg:text-5xl">
                    {tr("Browse Driving Vacancies Across All Indian States")}
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                    {tr("Showing")} <span className="font-extrabold text-navy-900">{filtered.length}</span> {tr("active vacancies available.")}
                </p>

                <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-1">
                    <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-navy-900">
                        <MapPin size={16} className="text-brand-dark" /> {tr("Major Hubs:")}
                    </span>
                    {["All India", ...HUBS].map((h) => {
                        const active = (h === "All India" && !f.hub) || f.hub === h;
                        return (
                            <button key={h} onClick={() => set("hub", h === "All India" ? "" : h)}
                                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-slate-600 hover:border-navy-900"
                                    }`}>
                                {h}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[320px_1fr]">
                {/* Filters */}
                <div>
                    <button onClick={() => setShowFilters((s) => !s)}
                        className="mb-4 flex w-full items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold lg:hidden">
                        <span className="inline-flex items-center gap-2"><SlidersHorizontal size={16} /> {tr("Pan-India Job Filters")}</span>
                        <span className="text-slate-400">{showFilters ? "−" : "+"}</span>
                    </button>

                    <aside className={`${showFilters ? "block" : "hidden"} rounded-xl border border-line bg-white p-5 lg:block`}>
                        <h2 className="hidden items-center gap-2 border-b border-line pb-4 font-sans text-sm font-extrabold uppercase tracking-wide lg:flex">
                            <SlidersHorizontal size={16} className="text-brand-dark" /> {tr("Pan-India Job Filters")}
                        </h2>

                        <div className="lg:mt-5">
                            <label className={lbl}>{tr("Search Keywords / Roles")}</label>
                            <div className="flex h-11 items-center gap-2.5 rounded-lg border border-line bg-paper px-3.5 focus-within:border-navy-900 focus-within:bg-white">
                                <Search size={15} className="text-slate-400" />
                                <input value={f.q} onChange={(e) => set("q", e.target.value)} placeholder={tr("Job title, transport fleet, skill...")}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-4 border-t border-line pt-5">{locationFields}</div>

                        <div className="mt-5 space-y-4 border-t border-line pt-5">
                            <div>
                                <label className={lbl}>{tr("Driver License / Vehicle Category")}</label>
                                <select className={selectCls} value={f.cat} onChange={(e) => set("cat", e.target.value)}>
                                    <option value="">{tr("All Vehicle Categories")}</option>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{tr(c)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>{tr("Must-Have Skill")}</label>
                                <select className={selectCls} value={f.skill} onChange={(e) => set("skill", e.target.value)}>
                                    <option value="">{tr("Any Driver Skill")}</option>
                                    {SKILLS.map((s) => <option key={s} value={s}>{tr(s)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={lbl}>{tr("Shift / Employment Type")}</label>
                                <select className={selectCls} value={f.emp} onChange={(e) => set("emp", e.target.value)}>
                                    <option value="">{tr("Any Type")}</option>
                                    {EMPLOYMENT.map((s) => <option key={s} value={s}>{tr(s)}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{tr("Minimum Guaranteed Salary")}</label>
                                    <span className="text-sm font-extrabold text-brand-dark">
                                        {f.minSalary ? `₹${f.minSalary.toLocaleString("en-IN")}+` : tr("Any")}
                                    </span>
                                </div>
                                <input type="range" min={0} max={40000} step={1000} value={f.minSalary}
                                    onChange={(e) => set("minSalary", Number(e.target.value))}
                                    className="h-2 w-full cursor-pointer accent-brand" />
                            </div>
                            <button onClick={() => { setF(EMPTY); setPage(1); }}
                                className="w-full rounded-lg border border-line py-3 text-sm font-bold text-slate-600 transition hover:border-navy-900 hover:text-navy-900">
                                {tr("Clear all filters")}
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Results */}
                <div>
                    {visible.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
                            <h3 className="text-2xl font-bold">{tr("No vacancies match your filters")}</h3>
                            <p className="mt-2 text-slate-500">{tr("Try removing a filter or choosing All India.")}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {visible.map((j) => <JobCard key={j.id} job={j} />)}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                        <span className="text-sm font-semibold text-slate-600">
                            {tr("Page")} {current} {tr("of")} {pages} ({filtered.length} {tr("Vacancies")})
                        </span>
                        <div className="flex gap-3">
                            <button disabled={current === 1} onClick={() => goPage(current - 1)}
                                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold transition hover:border-navy-900 disabled:text-slate-300 disabled:hover:border-line">
                                <ChevronLeft size={15} /> {tr("Previous")}
                            </button>
                            <button disabled={current === pages} onClick={() => goPage(current + 1)}
                                className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:bg-slate-200 disabled:text-slate-400">
                                {tr("Next")} <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}