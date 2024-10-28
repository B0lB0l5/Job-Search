import { model, Schema } from "mongoose";
//Schema
const applicationSchema = new Schema({

      jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userTechSkills: {
        type: [String],
        required: true,
      },
      userSoftSkills: {
        type: [String],
        required: true,
      },
      userResume: {
        secure_url: {
          type: String,
          required: true
      },
      public_id: {
          type: String,
          required: true
      }
      },
}, { timestamps: true });
//Model
export const Application = model('Application', applicationSchema)