// State -> District -> Town/City -> PIN codes
export const LOCATIONS = {
    Karnataka: {
        "Bengaluru Urban": {
            "Bengaluru (GPO / MG Road)": ["560001", "560002", "560003", "560004", "560005", "560006", "560007", "560008", "560009", "560010", "560011"],
            "Electronic City Phase 1": ["560100", "560099"],
            "Indiranagar 100ft Road": ["560038", "560008"],
            "Whitefield": ["560066", "560067"],
        },
        Mysuru: { "Mysuru (City / Saraswathipuram)": ["570001", "570009", "570017", "570023"] },
        Chikkaballapura: { Chikkaballapur: ["562101"] },
    },
    "Tamil Nadu": {
        Chennai: { "Chennai (Egmore / Anna Salai)": ["600002", "600008", "600032"] },
        Tiruvallur: { "Ennore Port": ["600019"] },
    },
    Telangana: { Hyderabad: { "Hyderabad (Hitec City / Madhapur)": ["500081", "500033", "500034"] } },
    Maharashtra: {
        Mumbai: { "Mumbai (Fort / Colaba)": ["400001", "400005"] },
        Pune: { "Pune (Shivajinagar)": ["411001", "411045"] },
    },
    Delhi: { "New Delhi": { "New Delhi (Connaught Place)": ["110001", "110037"] } },
    Kerala: { Ernakulam: { Kochi: ["682001", "682003"] } },
    "West Bengal": { Kolkata: { "Kolkata (Salt Lake)": ["700091", "700001"] } },
    Gujarat: { Ahmedabad: { Ahmedabad: ["380001", "380015"] } },
    Rajasthan: { Jaipur: { Jaipur: ["302001"] } },
};