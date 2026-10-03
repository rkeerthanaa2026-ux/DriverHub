import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ["candidate", "employer", "admin"], required: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        location: {
            state: String,
            district: String,
            city: String,
            pin: String,
        },
        // drivers (role: candidate)
        licenseType: String,
        experienceYears: Number,
        // employers
        companyName: String,
        industry: String,
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

// never send the password hash to the browser; expose _id as id
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    },
});

export default mongoose.model("User", userSchema);