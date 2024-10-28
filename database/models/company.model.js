import { model, Schema } from "mongoose";
import { empNum } from "../../src/utils/constant/enum.js";

// Schema
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  numberOfEmployees: {
    type: String,
    required: true,
    enum: Object.values(empNum),
    default: empNum.SMALL,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }
}, { timestamps: true });

// Model
export const Company = model('Company', companySchema);
