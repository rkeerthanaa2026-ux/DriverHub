import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Truck, MapPin, ChevronDown } from "lucide-react";

export const DRIVER_TYPES = [
    "HMV", "LMV", "Cab Driver", "Delivery Driver",
    "Bus Driver", "Tempo Driver", "Trailer Driver", "Commercial Driver",
];

export default function SearchBar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [q, setQ] = useState("");
    const [type, setType] = useState("");
    const [loc, setLoc] = useState("");

    const submit = (e) => {
        e.preventDefault();
        const p = new URLSearchParams();
        if (q) p.set("q", q);
        if (type) p.set("type", type);
        if (loc) p.set("loc", loc);
        navigate(`/jobs?${p.toString()}`);
    };

    const box =
        "flex h-12 items-center gap-2.5 rounded-lg border border-line bg-paper px-3.5 focus-within:border-navy-900 focus-within:bg-white";

    return (
        <form onSubmit={submit} className="grid w-full gap-2 rounded-xl border border-line bg-white p-3 sm:grid-cols-2">
            <label className={`${box} sm:col-span-2`}>
                <Search size={16} className="shrink-0 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("hero.q")}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
            </label>

            <label className={`${box} relative`}>
                <Truck size={16} className="shrink-0 text-slate-400" />
                <select value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-slate-800 outline-none">
                    <option value="">{t("hero.allTypes")}</option>
                    {DRIVER_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 text-slate-400" />
            </label>

            <label className={box}>
                <MapPin size={16} className="shrink-0 text-slate-400" />
                <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder={t("hero.loc")}
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
            </label>

            <button type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-extrabold text-navy-900 transition hover:brightness-95 sm:col-span-2">
                <Search size={16} /> {t("hero.search")}
            </button>
        </form>
    );
}