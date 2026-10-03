import Job from "../models/Job.js";
import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";

const OID = /^[a-f\d]{24}$/i;

const fail = (res, status, message) => {
    res.status(status);
    throw new Error(message);
};

const lines = (v) =>
    (Array.isArray(v) ? v : String(v || "").split("\n"))
        .map((s) => String(s).trim())
        .filter(Boolean)
        .slice(0, 12);

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// POST /api/jobs  (employer)
export const createJob = asyncHandler(async (req, res) => {
    const b = req.body;
    const place = b.place || {};
    const sMin = Number(b.salaryMin);
    const sMax = Number(b.salaryMax);
    const years = Math.max(0, Number(b.expYears) || 0);

    if (!b.title?.trim() || !b.cat || !b.desc?.trim()) fail(res, 400, "Please fill in all required fields.");
    if (!(sMin > 0) || !(sMax >= sMin)) fail(res, 400, "Enter a valid salary range.");
    if (!place.state || !place.district || !place.city || !place.pin) {
        fail(res, 400, "Please choose a valid State, District, Town and PIN code from the lists.");
    }

    const job = await Job.create({
        employer: req.user._id,
        title: b.title,
        company: req.user.companyName || req.user.name,
        cat: b.cat,
        emp: b.emp || "Full-time",
        skill: b.skill || "",
        desc: b.desc,
        vacancies: Math.max(1, Number(b.vacancies) || 1),
        sMin,
        sMax,
        salary: `${inr(sMin)} - ${inr(sMax)} / mo`,
        exp: `${years}+ Years`,
        shift: b.shift || "",
        location: b.area?.trim() || place.city,
        city: place.city,
        district: place.district,
        state: place.state,
        pin: place.pin,
        benefits: lines(b.benefits),
        skills: lines(b.skills),
        docs: lines(b.docs),
    });
    res.status(201).json({ job });
});

// GET /api/jobs  (public: open jobs)
export const listJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
    res.json({ jobs });
});

// GET /api/jobs/:id  (public)
export const getJob = asyncHandler(async (req, res) => {
    const job = OID.test(req.params.id) ? await Job.findById(req.params.id) : null;
    if (!job) fail(res, 404, "Job not found");
    res.json({ job });
});

// GET /api/jobs/mine  (employer: own postings with applicant counts)
export const myJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
        { $match: { employer: req.user._id } },
        { $group: { _id: "$jobId", total: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.total]));
    res.json({ jobs: jobs.map((j) => ({ ...j.toJSON(), applicants: map[j.id] || 0 })) });
});

const findOwn = async (req, res) => {
    const job = OID.test(req.params.id) ? await Job.findOne({ _id: req.params.id, employer: req.user._id }) : null;
    if (!job) fail(res, 404, "Job not found");
    return job;
};

// PATCH /api/jobs/:id/status   body: { status: "open" | "closed" }
export const setJobStatus = asyncHandler(async (req, res) => {
    const job = await findOwn(req, res);
    if (!["open", "closed"].includes(req.body.status)) fail(res, 400, "Invalid status.");
    job.status = req.body.status;
    await job.save();
    res.json({ job });
});

// DELETE /api/jobs/:id
export const deleteJob = asyncHandler(async (req, res) => {
    const job = await findOwn(req, res);
    await job.deleteOne();
    res.json({ message: "Job deleted" });
});