import { useState } from "react";
import { MapPin, Phone, Mail, Clock, ShieldAlert, Send, CheckCircle2 } from "lucide-react";
import useTr from "../../i18n/useTr";

const SUBJECTS = [
    "Driver Support Query",
    "Employer / Fleet Hiring",
    "Job Posting Help",
    "License Verification",
    "Report a Listing",
    "Other",
];

const EMPTY = { name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" };

const field =
    "h-[50px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white";
const label = "mb-2 block text-sm font-bold text-navy-900";

export default function Contact() {
    const { tr } = useTr();
    const [f, setF] = useState(EMPTY);
    const [sent, setSent] = useState(false);

    const upd = (k) => (e) => { setF((p) => ({ ...p, [k]: e.target.value })); setSent(false); };

    const submit = (e) => {
        e.preventDefault();
        try {
            const list = JSON.parse(localStorage.getItem("dh_inquiries") || "[]");
            localStorage.setItem("dh_inquiries", JSON.stringify([...list, { ...f, id: String(Date.now()), createdAt: new Date().toISOString() }]));
        } catch { /* ignore storage errors */ }
        setF(EMPTY);
        setSent(true);
    };

    const rows = [
        [MapPin, "DriverHub HQ, 2nd Floor, Phase 1, Electronic City, Bengaluru - 560100"],
        [Phone, "+91 80 2200 8899 (Toll Free Helpline)"],
        [Mail, "support@driverhub.in"],
        [Clock, "Monday - Saturday (9:00 AM - 7:00 PM IST)"],
    ];

    return (
        <div className="container-x py-14">
            <section className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-extrabold uppercase tracking-wide text-brand">{tr("Get in touch")}</p>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
                    {tr("We're Here to Help Drivers & Fleets 24/7")}
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
                    {tr("Have questions about job listings, RTO verification, or enterprise fleet hiring? Reach out to our dedicated support desk.")}
                </p>
            </section>

            <div className="mt-14 grid items-start gap-10 lg:grid-cols-[610px_1fr]">
                {/* Left: helpdesk card */}
                <aside className="rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
                    <h2 className="text-2xl font-extrabold">{tr("Central Operations & Helpdesk")}</h2>
                    <p className="mt-4 leading-relaxed text-slate-200">
                        {tr("Our national dispatch & verification desk is based in Bengaluru with regional support coordinators across South and Western India.")}
                    </p>

                    <ul className="mt-8 space-y-5">
                        {rows.map(([Icon, text]) => (
                            <li key={text} className="flex items-start gap-4 font-medium">
                                <Icon size={20} className="mt-0.5 shrink-0 text-brand" /> <span>{tr(text)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 border-t border-white/10 pt-6">
                        <p className="flex items-center gap-3 font-extrabold text-brand">
                            <ShieldAlert size={19} /> {tr("24/7 Highway Emergency Assistance")}
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                            {tr("For verified drivers currently on interstate transit routes:")} <span className="font-extrabold text-white">+91 99000 88776</span>
                        </p>
                    </div>
                </aside>

                {/* Right: form */}
                <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className={label}>{tr("Full Name")}</label>
                            <input required className={field} placeholder="Ravi Kumar" value={f.name} onChange={upd("name")} />
                        </div>
                        <div>
                            <label className={label}>{tr("Phone Number")}</label>
                            <input required type="tel" pattern="[+0-9 ]{10,15}" title="Enter a valid phone number" className={field}
                                placeholder="+91 98765 43210" value={f.phone} onChange={upd("phone")} />
                        </div>
                        <div>
                            <label className={label}>{tr("Email Address")}</label>
                            <input required type="email" className={field} placeholder="ravi@example.com" value={f.email} onChange={upd("email")} />
                        </div>
                        <div>
                            <label className={label}>{tr("Inquiry Subject")}</label>
                            <select className={field} value={f.subject} onChange={upd("subject")}>
                                {SUBJECTS.map((s) => <option key={s} value={s}>{tr(s)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className={label}>{tr("Message")}</label>
                        <textarea required rows={4} placeholder={tr("How can our recruitment team assist you today?")}
                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white"
                            value={f.message} onChange={upd("message")} />
                    </div>

                    {sent && (
                        <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 size={18} /> {tr("Thank you! Your inquiry has been sent. Our team will contact you shortly.")}
                        </p>
                    )}

                    <button type="submit"
                        className="mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-navy-900 text-base font-bold text-white transition hover:bg-navy-800">
                        <Send size={18} className="text-brand" /> {tr("Send Inquiry")}
                    </button>
                </form>
            </div>
        </div>
    );
}