import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useTr from "../../i18n/useTr";
import { ALL_STATUSES, LABEL } from "./status";

export default function AdminApplications() {
    const { tr } = useTr();
    const { user, loading } = useAuth();
    const [apps, setApps] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.role !== "admin") return;
        api("/applications").then((d) => setApps(d.applications)).catch((e) => setError(e.message));
    }, [user]);

    if (loading) return null;
    if (user?.role !== "admin") return <Navigate to="/login" replace />;

    const change = async (id, status) => {
        try {
            const d = await api(`/applications/${id}/status`, { method: "PATCH", body: { status } });
            setApps((list) => list.map((a) => (a.id === id ? { ...a, status: d.application.status } : a)));
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="container-x py-12">
            <h1 className="text-4xl font-extrabold text-navy-900">{tr("Manage Applications")}</h1>
            {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{tr(error)}</p>}

            <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                <table className="w-full min-w-[720px] text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-6 py-4">{tr("Applicant")}</th>
                            <th className="px-6 py-4">{tr("Job")}</th>
                            <th className="px-6 py-4">{tr("Status")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apps.map((a) => (
                            <tr key={a.id} className="border-b border-slate-100 last:border-0">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-navy-900">{a.candidate?.name}</p>
                                    <p className="text-sm text-slate-500">{a.candidate?.email} · {a.candidate?.phone}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-semibold">{a.job.title}</p>
                                    <p className="text-sm text-slate-500">{a.job.company}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <select value={a.status} onChange={(e) => change(a.id, e.target.value)}
                                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 font-semibold outline-none focus:border-brand">
                                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{tr(LABEL[s])}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}