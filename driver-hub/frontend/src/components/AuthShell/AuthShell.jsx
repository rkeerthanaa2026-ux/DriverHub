import { CheckCircle2 } from "lucide-react";
import LogoMark from "../LogoMark/LogoMark";
import useTr from "../../i18n/useTr";

const POINTS = ["Direct Hiring", "Zero Commission", "License documents reviewed"];

export default function AuthShell({ children, maxW = "max-w-[1280px]" }) {
    const { tr } = useTr();

    return (
        <div className="py-8 lg:py-12">
            <div className="container-x">
                <div className={`mx-auto grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-[5fr_6fr] ${maxW}`}>
                    {/* Left: photo panel, stays in view while the form scrolls */}
                    <aside className="relative hidden bg-navy-950 lg:block">
                        <div className="sticky top-[68px] flex h-[calc(100vh-68px)] max-h-[780px] min-h-[560px] flex-col justify-between overflow-hidden p-10 text-white">
                            <img src="/images/auth-driver.jpg" alt="Driver standing beside a truck"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                                className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20" />

                            <div className="relative flex items-center gap-3">
                                <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-lg bg-navy-900">
                                    <LogoMark size={44} />
                                </span>
                                <span className="font-display text-xl font-extrabold tracking-tight">
                                    DRIVER<span className="text-brand">HUB</span>
                                </span>
                            </div>

                            <div className="relative">
                                <h2 className="max-w-sm text-4xl font-extrabold leading-[1.1]">
                                    {tr("Find Driver Jobs Near You")}
                                </h2>
                                <ul className="mt-6 space-y-3">
                                    {POINTS.map((p) => (
                                        <li key={p} className="flex items-center gap-3 text-[15px] font-semibold text-slate-100">
                                            <CheckCircle2 size={18} className="shrink-0 text-brand" /> {tr(p)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Right: form */}
                    <div className="p-6 sm:p-10 lg:p-12">
                        <div className="flex items-center gap-3 lg:hidden">
                            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-navy-900">
                                <LogoMark size={40} />
                            </span>
                            <span className="font-display text-xl font-extrabold tracking-tight text-navy-900">
                                DRIVER<span className="text-brand-dark">HUB</span>
                            </span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}