import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export default function ComboBox({ value, onChange, options, placeholder, compact = false, clearable = false, disabled = false }) {
    const [open, setOpen] = useState(false);

    const exact = options.includes(value);
    const list = exact ? options : options.filter((o) => o.toLowerCase().includes(value.toLowerCase()));

    return (
        <div className="relative">
            <div className={`flex items-center gap-2.5 rounded-lg border border-line bg-white px-3.5 focus-within:border-navy-900 ${compact ? "h-11" : "h-12"} ${disabled ? "opacity-60" : ""}`}>
                <Search size={15} className="shrink-0 text-slate-400" />
                <input
                    value={value}
                    disabled={disabled}
                    onChange={(e) => { onChange(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 120)}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                {clearable && value && (
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); onChange(""); }} className="shrink-0 text-slate-400 hover:text-slate-700">
                        <X size={14} />
                    </button>
                )}
                <ChevronDown size={14} className="shrink-0 text-slate-400" />
            </div>
            {open && list.length > 0 && (
                <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 text-sm shadow-lg">
                    {list.map((o) => (
                        <li key={o} onMouseDown={() => { onChange(o); setOpen(false); }}
                            className="cursor-pointer px-3.5 py-2 font-medium hover:bg-paper">
                            {o}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}