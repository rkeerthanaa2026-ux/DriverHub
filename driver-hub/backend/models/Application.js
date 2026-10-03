import mongoose from "mongoose";

export const STATUSES = ["applied", "reviewing", "shortlisted", "interview", "hired", "rejected"];

const applicationSchema = new mongoose.Schema(
    {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        jobId: { type: String, required: true },
        job: {
            title: String,
            company: String,
            city: String,
            location: String,
            salary: String,
            category: String,
            img: String,
        },
        coverNote: { type: String, default: "", maxlength: 500 },
        status: { type: String, enum: STATUSES, default: "applied" },
        history: [{ status: String, at: { type: Date, default: Date.now } }],
    },
    { timestamps: true }
);

// one application per driver per job
applicationSchema.index({ candidate: 1, jobId: 1 }, { unique: true });

applicationSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model("Application", applicationSchema);