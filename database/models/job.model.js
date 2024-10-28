import { model, Schema } from "mongoose";
import {
    jobLocation,
    seniorityLevel,
    workingTime,
} from "../../src/utils/constant/enum.js";

// Schema
const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        enum: Object.values(jobLocation),
        required: true,
        default: jobLocation.ONSITE,
    },
    workingTime: {
        type: String,
        enum: Object.values(workingTime),
        required: true,
        default: workingTime.FULL_TIME,
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(seniorityLevel),
        required: true,
        default: seniorityLevel.JUNIOR,
    },
    description: {
        type: String,
        required: true,
    },
    technicalSkills: {
        type: [String],
        required: true,
    },
    softSkills: {
        type: [String],
        required: true,
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: { // Fixed company field to be an ObjectId, not an array
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    }
}, { timestamps: true });

// Model
export const Job = model("Job", jobSchema);
