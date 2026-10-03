import Application, { STATUSES } from "../models/Application.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";

const OID = /^[a-f\d]{24}$/i;

const fail = (res, status, message) => {
    res.status(status);
    throw new Error(message);
};

const CANDIDATE_FIELDS = "name email phone licenseType experienceYears location";

// POST /api/applications   body: { jobId, coverNote, job: {...snapshot} }
export const apply = asyncHandler(async (req, res) => {
    const { jobId, coverNote = "", job } = req.body;
    if (jobId === undefined || jobId === null) fail(res, 400, "Invalid job.");

    const id = String(jobId);
    if (await Application.findOne({ candidate: req.user._id, jobId: id })) {
        fail(res, 409, "You have already applied for this job.");
    }

    let snapshot;
    let employer = null;

    if (OID.test(id)) {
        // job posted by an employer: take the details from the database
        const dbJob = await Job.findById(id);
        if (!dbJob || dbJob.status !== "open") fail(res, 404, "This job is no longer open.");
        employer = dbJob.employer;
        snapshot = {
            title: dbJob.title, company: dbJob.company, city: dbJob.city, location: dbJob.location,
            salary: dbJob.salary, category: dbJob.cat, img: job?.img,
        };
    } else {
        // seeded demo job from the frontend data files
        if (!job?.title) fail(res, 400, "Invalid job.");
        snapshot = {
            title: job.title, company: job.company, city: job.city, location: job.location,
            salary: job.salary, category: job.category, img: job.img,
        };
    }

    const application = await Application.create({
        candidate: req.user._id,
        employer,
        jobId: id,
        job: snapshot,
        coverNote: String(coverNote).slice(0, 500),
        history: [{ status: "applied" }],
    });
    res.status(201).json({ application });
});

// GET /api/applications/mine
export const mine = asyncHandler(async (req, res) => {
    const applications = await Application.find({ candidate: req.user._id }).sort({ createdAt: -1 });
    res.json({ applications });
});

// GET /api/applications/employer   (applicants for this employer's jobs)
export const forEmployer = asyncHandler(async (req, res) => {
    const applications = await Application.find({ employer: req.user._id })
        .sort({ createdAt: -1 })
        .populate("candidate", CANDIDATE_FIELDS);
    res.json({ applications });
});

// DELETE /api/applications/:id   (driver withdraws own application)
export const withdraw = asyncHandler(async (req, res) => {
    const app = await Application.findOne({ _id: req.params.id, candidate: req.user._id });
    if (!app) fail(res, 404, "Application not found.");
    if (app.status === "hired") fail(res, 400, "A hired application cannot be withdrawn.");
    await app.deleteOne();
    res.json({ message: "Application withdrawn" });
});

// GET /api/applications   (admin: all applications)
export const listAll = asyncHandler(async (req, res) => {
    const applications = await Application.find()
        .sort({ createdAt: -1 })
        .populate("candidate", CANDIDATE_FIELDS);
    res.json({ applications });
});

// PATCH /api/applications/:id/status   body: { status }   (admin, or the employer who owns the job)
export const setStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!STATUSES.includes(status)) fail(res, 400, "Invalid status.");
    const app = await Application.findById(req.params.id);
    if (!app) fail(res, 404, "Application not found.");
    if (req.user.role === "employer" && String(app.employer) !== String(req.user._id)) {
        fail(res, 403, "You can only manage applications for your own jobs.");
    }
    app.status = status;
    app.history.push({ status });
    await app.save();
    res.json({ application: app });
});