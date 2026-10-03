export const features = [
    { icon: "💰", title: "Transparent Salaries", text: "Every listing shows its pay range so you can compare before you apply.", tag: "Clear Pay", link: "Find Jobs", to: "/jobs", img: "/images/feat-pay.jpg" },
    { icon: "🚛", title: "Verified Fleet Employers", text: "Explore verified employers and see their active vacancies.", tag: "Fleet Operators", link: "Top Employers", to: "/employers", img: "/images/feat-fleet.jpg" },
    { icon: "📱", title: "Application Updates", text: "Check your account notifications for updates supported by your current account settings.", tag: "Real-Time Alerts", link: "Register", to: "/register", img: "/images/feat-alerts.jpg" },
    { icon: "🚗", title: "Corporate & Executive Sedans", text: "Browse chauffeur openings and review each employer's requirements and pay details.", tag: "Corporate Driver Hiring", link: "Find Jobs", to: "/jobs?type=LMV", img: "/images/feat-sedan.jpg" },
    { icon: "🤝", title: "Zero Middlemen Commission", text: "Browse verified employers and review each job listing for its pay and hiring details.", tag: "Direct Hiring", link: "Explore Openings", to: "/jobs", img: "/images/feat-direct.jpg" },
    { icon: "✅", title: "Driver Verification", text: "Upload badge and license documents so employers can review your profile.", tag: "Verified Profile", link: "Register", to: "/register", img: "/images/feat-verify.jpg" },
];

export const categories = [
    { icon: "🚛", badge: "HMV", title: "Heavy Truck (HMV)", desc: "Multi-axle, interstate & container transport", count: 25, type: "HMV", img: "/images/cat-hmv.jpg" },
    { icon: "🚗", badge: "LMV", title: "LMV Chauffeur", desc: "Personal, corporate sedans & luxury fleet", count: 44, type: "LMV", img: "/images/cat-lmv.jpg" },
    { icon: "🚕", badge: "CAB DRIVER", title: "Cab Driver", desc: "App-based ride hailing & airport transfers", count: 20, type: "Cab Driver", img: "/images/cat-cab.jpg" },
    { icon: "📦", badge: "DELIVERY DRIVER", title: "Delivery Driver", desc: "E-commerce vans, 2-wheelers & hyperlocal", count: 20, type: "Delivery Driver", img: "/images/cat-delivery.jpg" },
    { icon: "🚌", badge: "BUS DRIVER", title: "School / Staff Bus", desc: "Passenger transit & student shuttle", count: 6, type: "Bus Driver", img: "/images/cat-bus.jpg" },
    { icon: "🚚", badge: "TEMPO DRIVER", title: "Tempo / Ace", desc: "Intra-city distribution & cargo logistics", count: 12, type: "Tempo Driver", img: "/images/cat-tempo.jpg" },
    { icon: "🚜", badge: "TRAILER DRIVER", title: "40ft Trailer Driver", desc: "Port container clearing & heavy haulage", count: 11, type: "Trailer Driver", img: "/images/cat-trailer.jpg" },
    { icon: "🚐", badge: "COMMERCIAL DRIVER", title: "Commercial Driver", desc: "Tour operations & outstation rentals", count: 26, type: "Commercial Driver", img: "/images/cat-commercial.jpg" },
];

export const jobs = [
    { id: 1, badge: "Cab Driver", tag: "Cab / Taxi", img: "/images/cat-cab.jpg", company: "QuickRide Mobility Solutions", title: "Executive Fleet Chauffeur (Sedans & SUVs)", vacancies: 8, salary: "₹22,000 - ₹28,000 / mo", location: "Indiranagar & Airport Corridor, Bengaluru", exp: "2+ Years", shift: "Flexible 9-hour shifts with weekly offs", desc: "QuickRide is expanding our executive fleet services. We provide company-owned automatic Innova Crysta, Honda City and Toyota Camry vehicles.", posted: "2026-09-15" },
    { id: 2, badge: "Bus Driver", tag: "Bus / Transit", img: "/images/cat-bus.jpg", company: "Sunrise International School", title: "School Bus & Student Van Driver", vacancies: 2, salary: "₹18,000 - ₹22,000 / mo", location: "Kuvempunagar, Mysuru", exp: "3+ Years", shift: "Split Shift: 6:30 AM - 10:30 AM & 3:00 PM - 5:30 PM", desc: "Looking for a cautious, punctual, and child-friendly driver to operate 32-seater school buses for daily student pick-up and drop.", posted: "2026-09-15" },
    { id: 3, badge: "Tempo Driver", tag: "Tempo / Tata Ace", img: "/images/cat-tempo.jpg", company: "Swift Express Logistics", title: "E-Commerce Delivery Pilot (Tata Ace / Tempo)", vacancies: 6, salary: "₹18,000 - ₹24,000 / mo", location: "Guindy & OMR, Chennai", exp: "1-3 Years", shift: "Day Shift (8:00 AM - 6:00 PM)", desc: "Join Chennai's fastest growing delivery network. Drive company Tata Ace / Mahindra Bolero Maxitruck to deliver parcels across the city.", posted: "2026-09-15" },
    { id: 4, badge: "Personal Driver", tag: "LMV Chauffeur", img: "/images/cat-lmv.jpg", company: "QuickRide Mobility Solutions", title: "Personal Family Driver (Luxury Sedans & Automatic Cars)", vacancies: 0, salary: "₹22,000 - ₹27,000 / mo", location: "Sadashivanagar & Malleshwaram, Bengaluru", exp: "4+ Years", shift: "9:00 AM to 7:00 PM (Mon - Sat)", desc: "Looking for a highly trustworthy, polite, and well-groomed personal chauffeur for a family in Sadashivanagar. Must have a clean driving record.", posted: "2026-09-15" },
    { id: 5, badge: "Delivery Driver", tag: "Delivery Van", img: "/images/cat-delivery.jpg", company: "Swift Express Logistics", title: "Electric Delivery Van Driver (City Hyperlocal)", vacancies: 10, salary: "₹19,000 - ₹23,000 / mo", location: "Hyderabad (Hitec City / Gachibowli)", exp: "1+ Year", shift: "Day Shift, 6 days/week", desc: "Drive zero-emission electric cargo vans (Tata Ace EV / Mahindra Zor Grand) for scheduled grocery and parcel drop-offs.", posted: "2026-09-15" },
    { id: 6, badge: "Bus Driver", tag: "Bus / Transit", img: "/images/cat-bus.jpg", company: "Sunrise Educational Transit", title: "School & Staff Bus Driver (PSV Badge Mandatory)", vacancies: 2, salary: "₹24,000 - ₹30,000 / mo", location: "Vijayanagar 2nd Stage, Mysuru", exp: "4+ Years", shift: "Morning & Afternoon split shifts", desc: "Safe student and faculty transit across designated school routes in Mysuru. Zero tolerance for speeding or rash driving.", posted: "2026-09-10" },
];

export const employers = [
    { name: "apex", industry: "edu-tech" },
    { name: "Bharat Logistics Pvt Ltd", industry: "Interstate Heavy Freight & Logistics" },
    { name: "FastTrack Urban Cabs", industry: "Urban Mobility & Fleet Services" },
    { name: "imall", industry: "e-commerce" },
    { name: "QuickRide Mobility Solutions", industry: "Logistics & Interstate Freight" },
    { name: "Sunrise Educational Transit", industry: "Student & Corporate Staff Transit" },
    { name: "Sunrise International School", industry: "Logistics & Interstate Freight" },
    { name: "Swift Express Logistics", industry: "Logistics & Interstate Freight" },
    { name: "Talent Manager Logistics", industry: "Logistics & Freight" },
];