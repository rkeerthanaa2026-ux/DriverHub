import { allJobs } from "./jobsData";
import { employers } from "./employersData";

const COMMON_DOCS = ["Aadhar Card", "PAN Card", "Bank Passbook"];

const BY_CAT = {
    "Cab Driver": {
        license: "LMV Commercial Badge",
        skills: ["GPS App Navigation", "Polite Communication (Kannada / English / Hindi)", "Clean Driving Track Record"],
        benefits: ["Fixed salary + daily trip incentives + fuel allowance.", "Comprehensive medical insurance cover for driver and spouse.", "Performance and customer rating bonus up to ₹5,000/month."],
    },
    LMV: {
        license: "LMV Licence (Non-Transport)",
        skills: ["Automatic Car Handling", "Punctuality & Discretion", "Neat Professional Appearance", "Clean Driving Track Record"],
        benefits: ["Fixed monthly salary with annual increment.", "Overtime paid beyond duty hours.", "Medical insurance and accident cover."],
    },
    HMV: {
        license: "HMV Licence",
        skills: ["Highway Driving Experience", "Multi-axle Vehicle Handling", "Basic Vehicle Maintenance", "Clean Driving Track Record"],
        benefits: ["Fuel card, trip bonus and rest allowance.", "Group accident insurance cover.", "Paid weekly off and festival bonus."],
    },
    "Trailer Driver": {
        license: "HMV Licence with Trailer Endorsement",
        skills: ["Container Trailer Handling", "Night Driving Experience", "Port / Depot Procedures", "Clean Driving Track Record"],
        benefits: ["Night shift allowance paid.", "Accident and life insurance cover.", "Monthly attendance bonus."],
    },
    "Bus Driver": {
        license: "HMV / PSV Badge",
        skills: ["Passenger Safety Handling", "Fixed Route Discipline", "Calm & Safe Driving", "Clean Driving Track Record"],
        benefits: ["Fixed salary with PF and ESI.", "Uniform and safety training provided.", "Paid leave and festival bonus."],
    },
    "Tempo Driver": {
        license: "LMV Transport Licence",
        skills: ["Route Knowledge", "Vehicle Maintenance Basics", "Loading Supervision", "Clean Driving Track Record"],
        benefits: ["Fixed salary with fuel and toll covered.", "Weekly off and festival bonus.", "Accident insurance cover."],
    },
    "Delivery Driver": {
        license: "LMV Licence",
        skills: ["GPS App Navigation", "Handheld Device Usage", "Time Management", "Clean Driving Track Record"],
        benefits: ["Fixed salary + per-delivery incentives.", "Fuel and handheld device provided.", "Accident insurance cover."],
    },
    "Commercial Driver": {
        license: "Commercial Driving Licence",
        skills: ["Passenger Handling", "Route & Tourist Spot Knowledge", "Good Communication", "Clean Driving Track Record"],
        benefits: ["Trip allowance and driver bonus.", "Food and stay covered on outstation trips.", "Accident insurance cover."],
    },
};

export function getJobDetail(job) {
    const cat = BY_CAT[job.cat] || BY_CAT["Cab Driver"];
    const emp = employers.find((e) => e.jobCompany === job.company);

    return {
        skills: [cat.license, ...cat.skills.slice(0, 3)],
        benefits: cat.benefits,
        docs: [cat.license.replace(" Badge", " License").replace("Licence", "License"), ...COMMON_DOCS],
        employer: {
            name: job.company,
            place: `${emp?.city || job.city}, ${emp?.state || job.state}`,
            vacancies: allJobs.filter((j) => j.company === job.company).length,
        },
    };
}

export function getSimilarJobs(job, limit = 3) {
    const same = allJobs.filter((j) => j.id !== job.id && (j.cat === job.cat || j.company === job.company));
    const rest = allJobs.filter((j) => j.id !== job.id && !same.includes(j));
    return [...same, ...rest].slice(0, limit);
}