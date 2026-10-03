import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true, maxlength: 120 },
        company: { type: String, required: true, trim: true },
        cat: { type: String, required: true },
        emp: { type: String, default: "Full-time" },
        skill: { type: String, default: "" },
        desc: { type: String, required: true, maxlength: 2000 },
        vacancies: { type: Number, default: 1, min: 1, max: 500 },
        sMin: Number,
        sMax: Number,
        salary: String,
        exp: String,
        shift: { type: String, default: "" },
        location: String,
        city: String,
        district: String,
        state: String,
        pin: String,
        benefits: [String],
        skills: [String],
        docs: [String],
        status: { type: String, enum: ["open", "closed"], default: "open" },
    },
    { timestamps: true }
);

jobSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model("Job", jobSchema);