import { useState } from "react";
import { Navigation } from "lucide-react";

export default function LogoMark({ size = 48 }) {
    const [broken, setBroken] = useState(false);

    if (!broken) {
        return (
            <img src="/images/logo.png" alt="Driver Hub" onError={() => setBroken(true)}
                style={{ width: size, height: size }} className="shrink-0 rounded-xl object-contain" />
        );
    }
    return (
        <div style={{ width: size, height: size }}
            className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-navy-900 text-brand">
            <Navigation size={size * 0.5} />
        </div>
    );
}