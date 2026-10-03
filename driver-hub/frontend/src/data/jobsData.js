import { jobs as base } from "./homeData";

const money = (n) => "₹" + n.toLocaleString("en-IN");

const imgByCat = {
    "Cab Driver": "/images/job-cab.jpg",
    "Bus Driver": "/images/job-bus.jpg",
    "Tempo Driver": "/images/job-tempo.jpg",
    LMV: "/images/job-lmv.jpg",
    "Delivery Driver": "/images/job-delivery.jpg",
    HMV: "/images/cat-hmv.jpg",
    "Trailer Driver": "/images/cat-trailer.jpg",
    "Commercial Driver": "/images/cat-commercial.jpg",
};

// Extra fields for the 6 jobs already used on the home page
const meta = {
    1: { cat: "Cab Driver", state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", hub: "Bengaluru", pin: "560038", sMin: 22000, sMax: 28000, skill: "Passenger Handling", emp: "Full-time" },
    2: { cat: "Bus Driver", state: "Karnataka", district: "Mysuru", city: "Mysuru", hub: "Mysuru", pin: "570009", sMin: 18000, sMax: 22000, skill: "Passenger Handling", emp: "Full-time" },
    3: { cat: "Tempo Driver", state: "Tamil Nadu", district: "Chennai", city: "Chennai", hub: "Chennai", pin: "600032", sMin: 18000, sMax: 24000, skill: "GPS Navigation", emp: "Full-time" },
    4: { cat: "LMV", state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", hub: "Bengaluru", pin: "560080", sMin: 22000, sMax: 27000, skill: "Automatic Cars", emp: "Full-time" },
    5: { cat: "Delivery Driver", state: "Telangana", district: "Hyderabad", city: "Hyderabad", hub: "Hyderabad", pin: "500081", sMin: 19000, sMax: 23000, skill: "GPS Navigation", emp: "Full-time" },
    6: { cat: "Bus Driver", state: "Karnataka", district: "Mysuru", city: "Mysuru", hub: "Mysuru", pin: "570017", sMin: 24000, sMax: 30000, skill: "Passenger Handling", emp: "Full-time" },
};

// id, badge, tag, cat, company, title, vacancies, sMin, sMax, area, city, hub, district, state, pin, exp, shift, skill, emp, desc
const rows = [
    [7, "HMV Driver", "Heavy Truck", "HMV", "Bharat Logistics Pvt Ltd", "Interstate Heavy Truck Driver (Multi-axle)", 5, 28000, 38000, "Bhiwandi Logistics Park", "Mumbai", "Mumbai", "Thane", "Maharashtra", "400001", "5+ Years", "Long-haul trips with rest allowance", "Highway Driving", "Full-time", "Drive 14-wheeler multi-axle trucks on Mumbai–Delhi corridor routes. Fuel card, trip bonus and insurance provided."],
    [8, "Trailer Driver", "40ft Trailer", "Trailer Driver", "Bharat Logistics Pvt Ltd", "40ft Container Trailer Driver (Port Clearing)", 4, 30000, 40000, "Ennore Port", "Chennai", "Chennai", "Tiruvallur", "Tamil Nadu", "600019", "4+ Years", "Rotational shifts, 6 days/week", "Highway Driving", "Full-time", "Port container clearing between Ennore port and inland depots. Valid HMV licence with trailer endorsement required."],
    [9, "Commercial Driver", "Tourist Vehicle", "Commercial Driver", "FastTrack Urban Cabs", "Tourist Vehicle Driver (Outstation Tours)", 6, 20000, 26000, "Shivajinagar", "Pune", "Pune", "Pune", "Maharashtra", "411001", "3+ Years", "Flexible, trip-based duty", "Night Driving", "Contract", "Operate tempo travellers and tourist vans for outstation tours. Good communication and route knowledge needed."],
    [10, "Cab Driver", "Cab / Taxi", "Cab Driver", "FastTrack Urban Cabs", "Airport Cab Driver (Prepaid Taxi)", 12, 21000, 27000, "IGI Airport Terminal 3", "New Delhi", "Delhi NCR", "New Delhi", "Delhi", "110037", "2+ Years", "Rotational 9-hour shifts", "Passenger Handling", "Full-time", "Airport pick-up and drop with company-owned sedans. Daily incentives on top of fixed pay."],
    [11, "Personal Driver", "LMV Chauffeur", "LMV", "QuickRide Mobility Solutions", "Corporate Sedan Chauffeur", 3, 23000, 29000, "Hitec City", "Hyderabad", "Hyderabad", "Hyderabad", "Telangana", "500081", "3+ Years", "9:00 AM to 7:00 PM (Mon - Fri)", "Automatic Cars", "Full-time", "Chauffeur for senior executives of a tech company. Neat appearance, punctuality and discretion required."],
    [12, "Delivery Driver", "Delivery Van", "Delivery Driver", "imall", "Last-Mile Delivery Van Driver", 9, 18000, 22000, "Salt Lake Sector V", "Kolkata", "Kolkata", "Kolkata", "West Bengal", "700091", "1+ Year", "Day Shift, 6 days/week", "GPS Navigation", "Full-time", "Deliver e-commerce parcels across Kolkata using company vans. Handheld device and fuel provided."],
    [13, "HMV Driver", "Heavy Truck", "HMV", "Talent Manager Logistics", "Container Truck Driver (Domestic Freight)", 7, 27000, 35000, "Sanand GIDC", "Ahmedabad", "Ahmedabad", "Ahmedabad", "Gujarat", "380015", "5+ Years", "Trip-based, weekly off", "Highway Driving", "Full-time", "Domestic container freight across Gujarat, Rajasthan and Maharashtra. Experienced HMV drivers only."],
    [14, "Bus Driver", "Bus / Transit", "Bus Driver", "apex", "Staff Shuttle Bus Driver (IT Park)", 3, 22000, 27000, "Electronic City Phase 1", "Bengaluru", "Bengaluru", "Bengaluru Urban", "Karnataka", "560100", "3+ Years", "Morning & evening pickup shifts", "Passenger Handling", "Full-time", "Operate 40-seater staff buses on fixed corporate routes. PSV badge and clean record required."],
    [15, "Tempo Driver", "Tempo / Tata Ace", "Tempo Driver", "Swift Express Logistics", "FMCG Distribution Driver (Tata Ace)", 8, 17000, 21000, "Sitapura Industrial Area", "Jaipur", "Jaipur", "Jaipur", "Rajasthan", "302001", "1-3 Years", "Day Shift (7:00 AM - 5:00 PM)", "Vehicle Maintenance", "Full-time", "Deliver FMCG goods to retail outlets across Jaipur on fixed daily routes."],
    [16, "Cab Driver", "Cab / Taxi", "Cab Driver", "FastTrack Urban Cabs", "Outstation Cab Driver (Sedan & SUV)", 5, 20000, 26000, "Ernakulam South", "Kochi", "Kochi", "Ernakulam", "Kerala", "682001", "2+ Years", "Flexible with overnight allowance", "Night Driving", "Contract", "Drive customers on outstation trips across Kerala and Tamil Nadu. Driver allowance and incentives included."],
    [17, "Commercial Driver", "Tempo Traveller", "Commercial Driver", "Sunrise Educational Transit", "Tempo Traveller Driver (Institute Trips)", 2, 21000, 25000, "Saraswathipuram", "Mysuru", "Mysuru", "Mysuru", "Karnataka", "570001", "3+ Years", "Day Shift with occasional trips", "Passenger Handling", "Part-time", "Drive tempo travellers for student excursions and staff trips. Safe, calm driving is a must."],
    [18, "Trailer Driver", "40ft Trailer", "Trailer Driver", "Talent Manager Logistics", "Port Trailer Driver (Container Haulage)", 3, 29000, 37000, "Willingdon Island", "Kochi", "Kochi", "Ernakulam", "Kerala", "682003", "4+ Years", "Rotational night & day shifts", "Night Driving", "Full-time", "Haul containers between Kochi port and warehouses. Night shift allowance paid."],
    [19, "Delivery Driver", "Delivery Van", "Delivery Driver", "imall", "Hyperlocal Delivery Pilot (Van & Bike)", 14, 16000, 20000, "Hinjewadi Phase 1", "Pune", "Pune", "Pune", "Maharashtra", "411045", "Fresher OK", "Day Shift, 6 days/week", "GPS Navigation", "Full-time", "Hyperlocal grocery and parcel deliveries within 10 km zones. Training provided for freshers."],
    [20, "Personal Driver", "LMV Chauffeur", "LMV", "apex", "Executive Chauffeur (Premium Sedans)", 2, 25000, 32000, "DLF Phase 3", "Gurugram", "Delhi NCR", "Gurugram", "Haryana", "122002", "5+ Years", "10-hour shift, rotational weekly off", "Automatic Cars", "Full-time", "Chauffeur for senior leadership in a corporate office. Immaculate driving record and professional etiquette required."],
];

const extra = rows.map(([id, badge, tag, cat, company, title, vacancies, sMin, sMax, area, city, hub, district, state, pin, exp, shift, skill, emp, desc], i) => ({
    id, badge, tag, cat, company, title, vacancies, sMin, sMax, city, hub, district, state, pin, exp, shift, skill, emp, desc,
    img: imgByCat[cat],
    salary: `${money(sMin)} - ${money(sMax)} / mo`,
    location: `${area}, ${city}`,
    posted: `2026-09-${String(14 - (i % 5)).padStart(2, "0")}`,
}));

export const allJobs = [
    ...base.map((j) => ({ ...j, ...meta[j.id] })),
    ...extra,
];

const uniq = (arr) => [...new Set(arr)].sort();

export const HUBS = ["Bengaluru", "Mumbai", "Delhi NCR", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Mysuru"];
export const CATEGORIES = ["HMV", "LMV", "Cab Driver", "Delivery Driver", "Bus Driver", "Tempo Driver", "Trailer Driver", "Commercial Driver"];
export const SKILLS = uniq(allJobs.map((j) => j.skill));
export const EMPLOYMENT = ["Full-time", "Part-time", "Contract"];
export const STATES = uniq(allJobs.map((j) => j.state));
export const DISTRICTS = uniq(allJobs.map((j) => j.district));
export const CITIES = uniq(allJobs.map((j) => j.city));
export const PINS = uniq(allJobs.map((j) => j.pin));