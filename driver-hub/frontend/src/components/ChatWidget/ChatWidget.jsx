import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bot, Sparkles, X, RefreshCw, Send, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";

/* ------------------------------------------------------------------ */
/* Knowledge base. Kannada is my own translation: have a speaker check */
/* ------------------------------------------------------------------ */
const INTENTS = [
    {
        id: "apply",
        keys: ["apply", "application", "hmv", "truck", "lmv", "cab", "how to get a job", "ಅರ್ಜಿ"],
        en: "To apply:\n1) Create a driver account (Register).\n2) Open Find Jobs and filter by HMV, LMV, Cab and more, then pick a vacancy.\n3) Click Apply Now and add a short note for the employer.\nYou can follow every application under My Applications.",
        kn: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು:\n1) ಚಾಲಕರಾಗಿ ನೋಂದಣಿ ಮಾಡಿ.\n2) ಉದ್ಯೋಗ ಹುಡುಕಿ ಪುಟದಲ್ಲಿ HMV, LMV, ಕ್ಯಾಬ್ ಮುಂತಾದ ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ ಹುದ್ದೆಯನ್ನು ಆರಿಸಿ.\n3) “ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ” ಒತ್ತಿ ಸಣ್ಣ ಟಿಪ್ಪಣಿ ಸೇರಿಸಿ.\nನಿಮ್ಮ ಅರ್ಜಿಯ ಸ್ಥಿತಿಯನ್ನು “ನನ್ನ ಅರ್ಜಿಗಳು” ಪುಟದಲ್ಲಿ ನೋಡಬಹುದು.",
        links: (u) => [
            ["/jobs", "Find Jobs"],
            u?.role === "candidate" ? ["/applications", "My Applications"] : !u ? ["/register?role=driver", "Register"] : null,
        ],
    },
    {
        id: "documents",
        keys: ["document", "upload", "licence", "license", "aadhar", "aadhaar", "pan card", "papers", "ದಾಖಲೆ"],
        en: "Employers usually ask you to carry original copies to the interview or driving test: your driving license (LMV, HMV or commercial badge as the job needs), Aadhar card, PAN card and a bank passbook. Each job page lists its own required documents.",
        kn: "ಸಂದರ್ಶನ ಅಥವಾ ಡ್ರೈವಿಂಗ್ ಪರೀಕ್ಷೆಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಮೂಲ ದಾಖಲೆಗಳನ್ನು ತರಬೇಕು: ಚಾಲನಾ ಪರವಾನಗಿ (ಹುದ್ದೆಗೆ ಅನುಗುಣವಾಗಿ LMV/HMV/ವಾಣಿಜ್ಯ ಬ್ಯಾಡ್ಜ್), ಆಧಾರ್ ಕಾರ್ಡ್, ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್. ಪ್ರತಿ ಉದ್ಯೋಗ ಪುಟದಲ್ಲೂ ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಇರುತ್ತದೆ.",
        links: () => [["/jobs", "Find Jobs"]],
    },
    {
        id: "salary",
        keys: ["salary", "pay", "earn", "wage", "income", "package", "ಸಂಬಳ", "ವೇತನ"],
        en: "Every listing shows its monthly pay range. Openings on Driver Hub currently run from about ₹18,000 to ₹30,000 a month, depending on the role, city and experience. Use the Minimum Salary slider on Find Jobs to filter, and check each listing for exact pay.",
        kn: "ಪ್ರತಿ ಹುದ್ದೆಯಲ್ಲೂ ತಿಂಗಳ ವೇತನ ಶ್ರೇಣಿ ತೋರಿಸಲಾಗಿದೆ. ಸದ್ಯದ ಹುದ್ದೆಗಳಲ್ಲಿ ಪಾತ್ರ, ನಗರ ಮತ್ತು ಅನುಭವದ ಆಧಾರದ ಮೇಲೆ ಸುಮಾರು ₹18,000 ರಿಂದ ₹30,000 ವರೆಗೆ ಇದೆ. ಉದ್ಯೋಗ ಹುಡುಕಿ ಪುಟದಲ್ಲಿ ಕನಿಷ್ಠ ವೇತನ ಸ್ಲೈಡರ್ ಬಳಸಿ ಫಿಲ್ಟರ್ ಮಾಡಬಹುದು. ನಿಖರ ವೇತನಕ್ಕೆ ಪ್ರತಿ ಹುದ್ದೆಯ ಪುಟ ನೋಡಿ.",
        links: () => [["/jobs", "Find Jobs"]],
    },
    {
        id: "post",
        keys: ["post", "vacancy", "vacancies", "publish", "employer account", "add a job", "ಪೋಸ್ಟ್"],
        en: "To post a vacancy: sign in with an Employer account (or register as one), open Post a Job, fill in the role, salary, location and requirements, and submit. It appears on Find Jobs straight away, and applicants show up in your Employer Dashboard.",
        kn: "ಹುದ್ದೆ ಪೋಸ್ಟ್ ಮಾಡಲು: ಉದ್ಯೋಗದಾತ ಖಾತೆಯಿಂದ ಸೈನ್ ಇನ್ ಮಾಡಿ (ಇಲ್ಲದಿದ್ದರೆ ನೋಂದಣಿ ಮಾಡಿ), “ಉದ್ಯೋಗ ಪೋಸ್ಟ್ ಮಾಡಿ” ತೆರೆದು ಹುದ್ದೆ, ವೇತನ, ಸ್ಥಳ ಮತ್ತು ಅರ್ಹತೆಗಳನ್ನು ತುಂಬಿ ಸಲ್ಲಿಸಿ. ಅದು ತಕ್ಷಣ ಉದ್ಯೋಗ ಹುಡುಕಿ ಪುಟದಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ, ಅರ್ಜಿದಾರರು ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಬರುತ್ತಾರೆ.",
        links: (u) =>
            u?.role === "employer"
                ? [["/employers/post-job", "Post a Job"], ["/employers/dashboard", "Employer Dashboard"]]
                : [["/register?role=employer", "Register"]],
    },
    {
        id: "shortlist",
        keys: ["shortlist", "employer", "hire", "hiring", "candidate", "recruit", "interview", "applicants"],
        en: "Employers see every applicant in Employer Dashboard → Applicants, with phone, email, license type and experience. They move each person through Applied → Under Review → Shortlisted → Interview → Hired, and hired drivers appear under Recruited Drivers.",
        kn: "ಉದ್ಯೋಗದಾತರು ಉದ್ಯೋಗದಾತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ → ಅರ್ಜಿದಾರರು ವಿಭಾಗದಲ್ಲಿ ಪ್ರತಿ ಅರ್ಜಿದಾರರ ಫೋನ್, ಇಮೇಲ್, ಪರವಾನಗಿ ಪ್ರಕಾರ ಮತ್ತು ಅನುಭವವನ್ನು ನೋಡಬಹುದು. ಪ್ರತಿಯೊಬ್ಬರನ್ನು ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದಾರೆ → ಪರಿಶೀಲನೆಯಲ್ಲಿ → ಆಯ್ಕೆ ಪಟ್ಟಿಯಲ್ಲಿ → ಸಂದರ್ಶನ → ನೇಮಕಗೊಂಡಿದ್ದಾರೆ ಹಂತಗಳಲ್ಲಿ ಮುಂದುವರಿಸಬಹುದು. ನೇಮಕಗೊಂಡವರು “ನೇಮಕಗೊಂಡ ಚಾಲಕರು” ನಲ್ಲಿ ಕಾಣಿಸುತ್ತಾರೆ.",
        links: (u) =>
            u?.role === "employer" ? [["/employers/dashboard", "Employer Dashboard"]] : [["/employers", "Top Employers"]],
    },
    {
        id: "track",
        keys: ["track", "status", "my applications", "progress", "applied"],
        en: "Open My Applications to see each job's stage on a progress tracker. When an employer changes your status, it updates there.",
        kn: "“ನನ್ನ ಅರ್ಜಿಗಳು” ಪುಟದಲ್ಲಿ ಪ್ರತಿ ಅರ್ಜಿಯ ಹಂತವನ್ನು ಟ್ರ್ಯಾಕರ್‌ನಲ್ಲಿ ನೋಡಬಹುದು. ಉದ್ಯೋಗದಾತರು ಸ್ಥಿತಿ ಬದಲಾಯಿಸಿದಾಗ ಅದು ಇಲ್ಲಿ ನವೀಕರಣವಾಗುತ್ತದೆ.",
        links: (u) => (u?.role === "candidate" ? [["/applications", "My Applications"]] : [["/login", "Sign In"]]),
    },
    {
        id: "verify",
        keys: ["verify", "verification", "verified", "badge", "trust", "safe"],
        en: "License documents are reviewed by an administrator, and a verification badge appears after approval. Employers get a Verified Partner badge after their profile is reviewed.",
        kn: "ಪರವಾನಗಿ ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಾಹಕರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ, ಅನುಮೋದನೆಯ ನಂತರ ಪರಿಶೀಲನಾ ಬ್ಯಾಡ್ಜ್ ಕಾಣಿಸುತ್ತದೆ. ಉದ್ಯೋಗದಾತರಿಗೆ ಪ್ರೊಫೈಲ್ ಪರಿಶೀಲನೆಯ ನಂತರ “ಪರಿಶೀಲಿತ ಪಾಲುದಾರ” ಬ್ಯಾಡ್ಜ್ ಸಿಗುತ್ತದೆ.",
        links: () => [["/about#safety", "About Safety & Welfare"]],
    },
    {
        id: "fees",
        keys: ["fee", "commission", "free", "cost", "charge", "agency", "middlemen"],
        en: "Driver Hub charges no commission and no agency fee. Drivers and employers connect directly.",
        kn: "Driver Hub ನಲ್ಲಿ ಯಾವುದೇ ಕಮಿಷನ್ ಅಥವಾ ಏಜೆನ್ಸಿ ಶುಲ್ಕ ಇಲ್ಲ. ಚಾಲಕರು ಮತ್ತು ಉದ್ಯೋಗದಾತರು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.",
        links: () => [],
    },
    {
        id: "support",
        keys: ["contact", "phone", "call", "support", "human", "agent", "email", "helpline"],
        en: "Our support desk: +91 80 2200 8899 or support@driverhub.in, Monday to Saturday, 9:00 AM to 7:00 PM IST.",
        kn: "ನಮ್ಮ ಸಹಾಯ ಕೇಂದ್ರ: +91 80 2200 8899, support@driverhub.in. ಸೋಮವಾರದಿಂದ ಶನಿವಾರ, ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7 (IST).",
        links: () => [["/contact", "Contact"]],
    },
    {
        id: "language",
        keys: ["kannada", "language", "ಕನ್ನಡ", "english"],
        en: "Use the EN | ಕನ್ನಡ switch in the top bar to change the whole site, and this chat, between English and Kannada.",
        kn: "ಮೇಲಿನ ಪಟ್ಟಿಯಲ್ಲಿರುವ EN | ಕನ್ನಡ ಸ್ವಿಚ್ ಬಳಸಿ ಇಡೀ ಸೈಟ್ ಮತ್ತು ಈ ಚಾಟ್ ಅನ್ನು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಿಸಬಹುದು.",
        links: () => [],
    },
];

const GREET = {
    en: "Hi! I'm the Driver Hub assistant. Ask me about finding driver jobs, licenses, documents, salary, or posting a vacancy.",
    kn: "ನಮಸ್ಕಾರ! ನಾನು Driver Hub ಸಹಾಯಕ. ಚಾಲಕ ಉದ್ಯೋಗ, ಪರವಾನಗಿ, ದಾಖಲೆಗಳು, ವೇತನ ಅಥವಾ ಹುದ್ದೆ ಪೋಸ್ಟ್ ಮಾಡುವ ಬಗ್ಗೆ ಕೇಳಿ.",
};

const FALLBACK = {
    en: "I'm not sure about that one. Try asking about applying, documents, salary, posting a job or verification, or call us on +91 80 2200 8899.",
    kn: "ಇದರ ಬಗ್ಗೆ ನನಗೆ ಖಚಿತವಿಲ್ಲ. ಅರ್ಜಿ ಸಲ್ಲಿಕೆ, ದಾಖಲೆಗಳು, ವೇತನ, ಉದ್ಯೋಗ ಪೋಸ್ಟ್ ಅಥವಾ ಪರಿಶೀಲನೆಯ ಬಗ್ಗೆ ಕೇಳಿ, ಅಥವಾ +91 80 2200 8899 ಗೆ ಕರೆ ಮಾಡಿ.",
};

const WELCOME = {
    en: "Hello! How can I help you today? You can ask me about finding driver jobs, required licenses (LMV / HMV / Commercial), employer posting rules, profile verification, or salary.",
    kn: "ನಮಸ್ಕಾರ! ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಚಾಲಕ ಉದ್ಯೋಗ, ಅಗತ್ಯ ಪರವಾನಗಿ (LMV / HMV / ವಾಣಿಜ್ಯ), ಉದ್ಯೋಗದಾತರ ಪೋಸ್ಟಿಂಗ್ ನಿಯಮಗಳು, ಪ್ರೊಫೈಲ್ ಪರಿಶೀಲನೆ ಅಥವಾ ವೇತನದ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
};

const SUGGESTIONS = [
    { id: "apply", en: "How to apply for HMV truck jobs?", kn: "HMV ಟ್ರಕ್ ಉದ್ಯೋಗಕ್ಕೆ ಅರ್ಜಿ ಹೇಗೆ?" },
    { id: "documents", en: "What documents do I need to upload?", kn: "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?" },
    { id: "shortlist", en: "How do employers shortlist candidates?", kn: "ಉದ್ಯೋಗದಾತರು ಹೇಗೆ ಆಯ್ಕೆ ಮಾಡುತ್ತಾರೆ?" },
    { id: "salary", en: "Typical driver salary in Bengaluru/Chennai", kn: "ಬೆಂಗಳೂರು/ಚೆನ್ನೈ ಚಾಲಕರ ಸಾಮಾನ್ಯ ವೇತನ" },
    { id: "post", en: "How do I post a driver job vacancy?", kn: "ಚಾಲಕ ಹುದ್ದೆ ಹೇಗೆ ಪೋಸ್ಟ್ ಮಾಡುವುದು?" },
];

function findIntent(text) {
    const s = text.toLowerCase().trim();
    if (/^(hi|hii|hey|hello|namaste|namaskara)\b/.test(s) || s.startsWith("ನಮಸ್ಕಾರ")) return "greet";
    let best = null;
    let top = 0;
    for (const it of INTENTS) {
        const score = it.keys.reduce((n, k) => n + (s.includes(k) ? 1 : 0), 0);
        if (score > top) { top = score; best = it.id; }
    }
    return best;
}

export default function ChatWidget() {
    const { t } = useTranslation();
    const { isKn } = useTr();
    const { user } = useAuth();
    const L = (en, kn) => (isKn ? kn : en);

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const timer = useRef(null);
    const endRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    useEffect(() => {
        if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, typing, open]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const buildReply = (text, forcedId) => {
        const id = forcedId || findIntent(text);
        const lang = isKn ? "kn" : "en";
        if (id === "greet") return { text: GREET[lang], links: [] };
        const intent = INTENTS.find((i) => i.id === id);
        if (!intent) return { text: FALLBACK[lang], links: [["/contact", "Contact"]] };
        return { text: intent[lang], links: intent.links(user).filter(Boolean) };
    };

    const send = (text, forcedId) => {
        const q = text.trim();
        if (!q || typing) return;
        setMessages((m) => [...m, { from: "user", text: q }]);
        setInput("");
        setTyping(true);
        timer.current = setTimeout(() => {
            setMessages((m) => [...m, { from: "bot", ...buildReply(q, forcedId) }]);
            setTyping(false);
        }, 650);
    };

    const reset = () => {
        clearTimeout(timer.current);
        setMessages([]);
        setTyping(false);
        setInput("");
    };

    const Chips = ({ className = "" }) => (
        <div className={className}>
            {SUGGESTIONS.map((s) => (
                <button key={s.id} type="button" onClick={() => send(L(s.en, s.kn), s.id)}
                    className="shrink-0 rounded-full border border-line bg-white px-3.5 py-2 text-left text-[13px] font-semibold text-navy-900 transition hover:border-navy-900 hover:bg-paper">
                    {L(s.en, s.kn)}
                </button>
            ))}
        </div>
    );

    /* ------------------------- closed: launcher ------------------------- */
    if (!open) {
        return (
            <button onClick={() => setOpen(true)} aria-label="Open assistant"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-900 px-5 py-3 text-left text-white shadow-2xl transition hover:bg-navy-800">
                <Bot className="text-brand" size={26} />
                <span className="leading-tight">
                    <span className="flex items-center gap-1 text-sm font-bold">
                        {t("chat.title")} <Sparkles size={13} className="text-brand" />
                    </span>
                    <span className="block text-xs text-slate-300">{t("chat.sub")}</span>
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            </button>
        );
    }

    /* ----------------------------- open: panel ----------------------------- */
    return (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(620px,calc(100vh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:w-[400px]">
            {/* Header */}
            <div className="flex items-center gap-3 bg-navy-900 px-4 py-3.5 text-white">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-800">
                    <Bot size={22} className="text-brand" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy-900 bg-brand" />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="flex items-center gap-1.5 text-sm font-bold">
                        {t("chat.title")} <Sparkles size={13} className="text-brand" />
                        <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-navy-900">
                            {L("Online", "ಆನ್‌ಲೈನ್")}
                        </span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-300">{t("chat.sub")}</p>
                </div>
                <button onClick={reset} aria-label="Restart chat" title={L("Restart chat", "ಚಾಟ್ ಮರುಪ್ರಾರಂಭಿಸಿ")}
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white">
                    <RefreshCw size={16} />
                </button>
                <button onClick={() => setOpen(false)} aria-label="Close chat"
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            {/* Conversation */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-paper px-4 py-5">
                {/* welcome */}
                <div className="flex gap-2.5">
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900">
                        <Bot size={15} className="text-brand" />
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
                        {L(WELCOME.en, WELCOME.kn)}
                    </div>
                </div>

                {messages.length === 0 && (
                    <div>
                        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            {L("Quick suggestions", "ತ್ವರಿತ ಸಲಹೆಗಳು")}
                        </p>
                        <Chips className="flex flex-wrap gap-2" />
                    </div>
                )}

                {messages.map((m, i) =>
                    m.from === "user" ? (
                        <div key={i} className="flex justify-end">
                            <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-navy-900 px-4 py-3 text-sm leading-relaxed text-white">
                                {m.text}
                            </div>
                        </div>
                    ) : (
                        <div key={i} className="flex gap-2.5">
                            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900">
                                <Bot size={15} className="text-brand" />
                            </span>
                            <div className="max-w-[85%]">
                                <div className="whitespace-pre-line rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
                                    {m.text}
                                </div>
                                {m.links?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {m.links.map(([to, label]) => (
                                            <Link key={to} to={to}
                                                className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-extrabold text-navy-900 transition hover:brightness-95">
                                                {t(label, { defaultValue: label })}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}

                {typing && (
                    <div className="flex gap-2.5">
                        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900">
                            <Bot size={15} className="text-brand" />
                        </span>
                        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-white px-4 py-3.5">
                            {[0, 150, 300].map((d) => (
                                <span key={d} style={{ animationDelay: `${d}ms` }}
                                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Suggestions row once the chat has started */}
            {messages.length > 0 && (
                <Chips className="flex gap-2 overflow-x-auto border-t border-line bg-paper px-4 py-2.5" />
            )}

            {/* Live support strip */}
            <div className="flex items-center justify-between border-t border-line bg-white px-4 py-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                    <Phone size={13} className="text-brand-dark" /> {L("Need live support?", "ನೇರ ಸಹಾಯ ಬೇಕೇ?")}
                </span>
                <a href="tel:+918022008899" className="font-extrabold text-navy-900 hover:text-brand-dark">+91 80 2200 8899</a>
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2.5 border-t border-line bg-white p-3">
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder={L("Ask about driver jobs, licenses, salary...", "ಚಾಲಕ ಉದ್ಯೋಗ, ಪರವಾನಗಿ, ವೇತನದ ಬಗ್ಗೆ ಕೇಳಿ...")}
                    className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-sm outline-none placeholder:text-slate-400 focus:border-navy-900 focus:bg-white" />
                <button type="submit" disabled={!input.trim() || typing} aria-label="Send"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-navy-900 transition hover:brightness-95 disabled:bg-slate-200 disabled:text-slate-400">
                    <Send size={17} />
                </button>
            </form>
        </div>
    );
}