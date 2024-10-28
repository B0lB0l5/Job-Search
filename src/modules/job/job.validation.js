import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const addJobValidation = joi.object({
    title: generalFields.name.required(),
    location: generalFields.address.required(),
    workingTime: generalFields.workingTime.required(),
    seniorityLevel: generalFields.seniorityLevel.required(),
    description: generalFields.description.required(),
    technicalSkills: generalFields.technicalSkills.required(),
    softSkills: generalFields.softSkills.required(),
    company: generalFields.objectId.required()
});

export const updateJobValidation = joi.object({
    title: generalFields.name.required(),
    location: generalFields.address.required(),
    workingTime: generalFields.workingTime.required(),
    seniorityLevel: generalFields.seniorityLevel.required(),
    description: generalFields.description.required(),
    technicalSkills: generalFields.technicalSkills.required(),
    softSkills: generalFields.softSkills.required(),
    company: generalFields.objectId.required(),
    id: generalFields.objectId.required()
});

export const deleteJobValidation = joi.object({
    id: generalFields.objectId.required()
});

export const getAllJobsForCompanyValidation = joi.object({
    companyId: generalFields.objectId.required()
});

export const applyToJobValidation = joi.object({
    jobId: generalFields.objectId.required(), 
    userTechSkills: generalFields.technicalSkills.required(), 
    userSoftSkills: generalFields.softSkills.required(), 
    // userResume,
    // userId
});