// import modules
import joi from "joi";
import { AppError } from "../utils/appError.js";
import { roles, jobLocation, seniorityLevel, workingTime } from "../utils/constant/enum.js";

const parseArray = (value, helper) => {
  let data = JSON.parse(value);
  let schema = joi.array().items(joi.string());
  const { error } = schema.validate(data);
  if (error) {
    return helper(error.details);
  }
  return true;
};

export const generalFields = {
  name: joi.string(),
  email: joi.string().email(),
  password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
  cPassword: joi.string().valid(joi.ref("password")),
  phone: joi.string().pattern(/^01[0-2,5][0-9]{8}$/),
  DOB: joi.string(),
  objectId: joi.string().hex().length(24),
  otp: joi.string().length(6),
  description: joi.string().max(2000),
  numberOfEmployees: joi.string().pattern(/^(?:[1-9]\d{0,2})-(?:[1-9]\d{0,2})$/),
  jobLocation: joi.string().valid(...Object.values(jobLocation)),
  workingTime: joi.string().valid(...Object.values(workingTime)),
  seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
  technicalSkills: joi.custom(parseArray),
  softSkills: joi.custom(parseArray),
  industry: joi.string(),
  address: joi.string(),
  companyHR: joi.string(),
  role: joi.string().valid(roles.COMPANY_HR, roles.USER),
  date: joi.date().iso(),
  
};

export const isValid = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      let errArr = error.details.map((err) => err.message);
      return next(new AppError(errArr.join(", "), 400));
    }
    next();
  };
};
