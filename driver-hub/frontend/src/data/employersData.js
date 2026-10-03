import { allJobs } from "./jobsData";

// jobCompany = the company name used in jobsData (so vacancy counts stay in sync with Find Jobs)
const base = [
    { id: 1, name: "apex", industry: "edu-tech", area: "Chikkaballapur", city: "Chikkaballapur", district: "Chikkaballapura", state: "Karnataka", pin: "562101", tag: "Transit Fleet", img: "/images/cat-bus.jpg" },
    { id: 2, name: "Bharat Logistics Pvt Ltd", industry: "Interstate Heavy Freight & Logistics", area: "Electronic City Phase 1", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pin: "560100", tag: "Heavy Truck (HMV)", img: "/images/cat-hmv.jpg" },
    { id: 3, name: "FastTrack Urban Cabs", industry: "Urban Mobility & Fleet Services", area: "Indiranagar 100ft Road", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pin: "560038", tag: "Cab / Taxi", img: "/images/cat-cab.jpg" },
    { id: 4, name: "QuickRide Mobility Solutions", industry: "Corporate Mobility & Chauffeur", area: "Hitec City", city: "Hyderabad", district: "Hyderabad", state: "Telangana", pin: "500081", tag: "Chauffeur / LMV", img: "/images/cat-lmv.jpg" },
    { id: 5, name: "imall", industry: "E-commerce & Last-Mile Delivery", area: "Salt Lake Sector V", city: "Kolkata", district: "Kolkata", state: "West Bengal", pin: "700091", tag: "Delivery Van", img: "/images/cat-delivery.jpg" },
    { id: 6, name: "Greenline Tours & Travels", industry: "Tourism & Travel", area: "Shivajinagar", city: "Pune", district: "Pune", state: "Maharashtra", pin: "411001", tag: "Tourist Vehicle", img: "/images/cat-commercial.jpg" },
    { id: 7, name: "Sunrise International School", jobCompany: "Sunrise Educational Transit", industry: "Logistics & Interstate Freight", area: "Kuvempunagar", city: "Mysuru", district: "Mysuru", state: "Karnataka", pin: "570023", tag: "Transit Fleet", img: "/images/cat-bus.jpg" },
    { id: 8, name: "Swift Express Logistics", industry: "Logistics & Interstate Freight", area: "Hyderabad (Hitec City / Madhapur)", city: "Hyderabad", district: "Hyderabad", state: "Telangana", pin: "500081", tag: "Tempo / Tata Ace", img: "/images/cat-tempo.jpg" },
    { id: 9, name: "Talent Manager Logistics", industry: "Logistics & Freight", area: "Bengaluru", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pin: "560001", tag: "Trailer / Container", img: "/images/cat-trailer.jpg" },
];

export const employers = base.map((e) => {
    const jobCompany = e.jobCompany || e.name;
    return {
        ...e,
        jobCompany,
        vacancies: allJobs.filter((j) => j.company === jobCompany).length,
    };
});

const uniq = (arr) => [...new Set(arr)].sort();
export const E_STATES = uniq(employers.map((e) => e.state));
export const E_DISTRICTS = uniq(employers.map((e) => e.district));
export const E_CITIES = uniq(employers.map((e) => e.city));
export const E_PINS = uniq(employers.map((e) => e.pin));