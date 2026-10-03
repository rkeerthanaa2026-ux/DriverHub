import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Compass, Send } from "lucide-react";
import ComboBox from "../../components/ComboBox/ComboBox";
import { LOCATIONS } from "../../data/locationData";
import { CATEGORIES, SKILLS, EMPLOYMENT } from "../../data/jobsData";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";

const input =
    "h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white";
const area =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white";
const label = "mb-2 block text-sm font-bold text-navy-900";
const locLabel = "mb-2 block text-sm font-extrabold uppercase tracking-wide text-navy-900";

export default function PostJob() {
    const { tr } = useTr();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [f, setF] = useState({
        title: "", cat: "", emp: "Full-time", skill: "", vacancies: 1,
        salaryMin: "", salaryMax: "", expYears: 0, shift: "", area: "",
        desc: "", benefits: "", skills: "",
        docs: "LMV Commercial License\nAadhar Card\nPAN Card\nBank Passbook",
    });
    const [loc, setLoc] = useState({
        state: user?.location?.state || "", district: user?.location?.district || "",
        city: user?.location?.city || "", pin: user?.location?.pin || "",
    });
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

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

    const upd = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

    if (loading) return null;
    if (!user) return <Navigate to="/login?redirect=/employers/post-job" replace />;
    if (user.role !== "employer") {
        return <div className="container-x py-24 text-center text-lg text-slate-600">{tr("Only employer accounts can post jobs.")}</div>;
    }

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        if (!pins.includes(loc.pin)) {
            setError("Please choose a valid State, District, Town and PIN code from the lists.");
            return;
        }
        setBusy(true);
        try {
            await api("/jobs", { method: "POST", body: { ...f, place: loc } });
            navigate("/employers/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="container-x py-12">
            <h1 className="text-4xl font-extrabold text-navy-900">{tr("Post a Driver Job")}</h1>
            <p className="mt-3 text-lg text-slate-600">{tr("Your vacancy appears on the Find Jobs page as soon as you post it.")}</p>

            <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <div>
                    <label className={label}>{tr("Job Title")}</label>
                    <input required className={input} placeholder="e.g. Executive Fleet Chauffeur" value={f.title} onChange={upd("title")} />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div>
                        <label className={label}>{tr("Driver License / Vehicle Category")}</label>
                        <select required className={input} value={f.cat} onChange={upd("cat")}>
                            <option value="">{tr("Select category")}</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{tr(c)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={label}>{tr("Shift / Employment Type")}</label>
                        <select className={input} value={f.emp} onChange={upd("emp")}>
                            {EMPLOYMENT.map((c) => <option key={c} value={c}>{tr(c)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={label}>{tr("Must-Have Skill")}</label>
                        <select className={input} value={f.skill} onChange={upd("skill")}>
                            <option value="">{tr("Any Driver Skill")}</option>
                            {SKILLS.map((c) => <option key={c} value={c}>{tr(c)}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-4">
                    <div>
                        <label className={label}>{tr("Minimum Salary (₹ / month)")}</label>
                        <input required type="number" min="1" className={input} value={f.salaryMin} onChange={upd("salaryMin")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Maximum Salary (₹ / month)")}</label>
                        <input required type="number" min="1" className={input} value={f.salaryMax} onChange={upd("salaryMax")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Years of Experience")}</label>
                        <input type="number" min="0" max="50" className={input} value={f.expYears} onChange={upd("expYears")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Number of Vacancies")}</label>
                        <input required type="number" min="1" max="500" className={input} value={f.vacancies} onChange={upd("vacancies")} />
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className={label}>{tr("Working Shifts")}</label>
                        <input className={input} placeholder="e.g. Day Shift (8:00 AM - 6:00 PM)" value={f.shift} onChange={upd("shift")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Job Location")}</label>
                        <input className={input} placeholder="e.g. Indiranagar & Airport Corridor" value={f.area} onChange={upd("area")} />
                    </div>
                </div>

                <div>
                    <label className={label}>{tr("Job Description & Duties")}</label>
                    <textarea required rows={4} maxLength={2000} className={area} value={f.desc} onChange={upd("desc")} />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div>
                        <label className={label}>{tr("Benefits (one per line)")}</label>
                        <textarea rows={5} className={area} placeholder={"Fixed salary + incentives\nMedical insurance"} value={f.benefits} onChange={upd("benefits")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Required Skills (one per line)")}</label>
                        <textarea rows={5} className={area} placeholder={"GPS App Navigation\nClean Driving Track Record"} value={f.skills} onChange={upd("skills")} />
                    </div>
                    <div>
                        <label className={label}>{tr("Documents to carry (one per line)")}</label>
                        <textarea rows={5} className={area} value={f.docs} onChange={upd("docs")} />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-navy-900">
                        <Compass size={17} className="text-brand" /> Pan-India Location Hierarchy (Type to search or select)
                    </h3>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={locLabel}>1. State / Union Territory *</label>
                            <ComboBox compact clearable value={loc.state} onChange={(v) => setLevel("state", v)} options={states} placeholder="Type or select State / UT" />
                        </div>
                        <div>
                            <label className={locLabel}>2. District *</label>
                            <ComboBox compact clearable value={loc.district} onChange={(v) => setLevel("district", v)} options={districts} placeholder="Type or select District" />
                        </div>
                        <div>
                            <label className={locLabel}>3. Town / City / Locality *</label>
                            <ComboBox compact clearable value={loc.city} onChange={(v) => setLevel("city", v)} options={cities} placeholder="Type or select Town / City" />
                        </div>
                        <div>
                            <label className={locLabel}>4. PIN Code *</label>
                            <ComboBox compact clearable value={loc.pin} onChange={(v) => setLevel("pin", v)} options={pins} placeholder="Type or select PIN" />
                        </div>
                    </div>
                </div>

                {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

                <div className="flex flex-wrap justify-end gap-3">
                    <Link to="/employers/dashboard" className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 hover:bg-slate-50">{tr("Cancel")}</Link>
                    <button type="submit" disabled={busy}
                        className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-8 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60">
                        <Send size={17} className="text-brand" /> {busy ? tr("Posting...") : tr("Post Job")}
                    </button>
                </div>
            </form>
        </div>
    );
}