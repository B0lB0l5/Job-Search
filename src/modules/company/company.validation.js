import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCompanyValidation = joi.object({
  name: generalFields.name.required(),
  description: generalFields.description.required(),
  industry: generalFields.industry.required(),
  address: generalFields.address.required(),
  numberOfEmployees: generalFields.numberOfEmployees.required(),
  companyEmail: generalFields.email.required(),
});

// get a specific company
export const getSpecificCompanyValidation = joi.object({
    id : generalFields.objectId.required()
})

export const updateCompanyValidation = joi.object({
  name: generalFields.name.required(),
  description: generalFields.description.required(),
  industry: generalFields.industry.required(),
  address: generalFields.address.required(),
  numberOfEmployees: generalFields.numberOfEmployees.required(),
  companyEmail: generalFields.email.required(),
  id: generalFields.objectId.required(),
});

export const deleteCompanyValidation = joi.object({
    id : generalFields.objectId.required()
});

export const searchCompanyByNameValidation = joi.object({
    name : generalFields.name.required()
});

export const getApplicationJobVal = joi.object({
  jobId: generalFields.objectId.required()
})

export const getApplicationsReportVal = joi.object({
  companyId: generalFields.objectId.required(),
  date:generalFields.date.required(),
})

