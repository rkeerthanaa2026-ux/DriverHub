import { useEffect, useMemo, useState } from "react";
import { api } from "./client";
import { allJobs, HUBS } from "../data/jobsData";

export function toJobShape(j) {
    const sample = allJobs.find((s) => s.cat === j.cat) || {};
    return {
        id: j.id,
        custom: true,
        title: j.title,
        company: j.company,
        cat: j.cat,
        emp: j.emp,
        skill: j.skill,
        desc: j.desc,
        vacancies: j.vacancies,
        salary: j.salary,
        sMin: j.sMin,
        exp: j.exp,
        shift: j.shift,
        location: j.location,
        city: j.city,
        district: j.district,
        state: j.state,
        pin: j.pin,
        hub: HUBS.find((h) => String(j.city).toLowerCase().includes(h.toLowerCase())) || "",
        posted: String(j.createdAt || "").slice(0, 10),
        img: sample.img || "",
        badge: sample.badge || j.cat,
        tag: sample.tag || j.cat,
        detail: {
            benefits: j.benefits || [],
            skills: j.skills || [],
            docs: j.docs || [],
            employer: { name: j.company, place: `${j.city}, ${j.state}`, vacancies: j.vacancies },
        },
    };
}

// employer-posted jobs first, then the seeded demo jobs
export function useAllJobs() {
    const [dbJobs, setDbJobs] = useState([]);
    useEffect(() => {
        api("/jobs").then((d) => setDbJobs(d.jobs.map(toJobShape))).catch(() => { });
    }, []);
    return useMemo(() => [...dbJobs, ...allJobs], [dbJobs]);
}