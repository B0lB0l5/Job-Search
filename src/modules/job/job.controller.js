import slugify from "slugify";
import { Application, Company, Job } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";
import { ApiFeature } from "../../utils/apiFeature.js";

// add job
export const addJob = async (req, res, next) => {
  // Get data from req
  let {
    title,
    location,
    workingTime,
    seniorityLevel,
    description,
    technicalSkills,
    softSkills,
    company 
  } = req.body;
  title = title.toLowerCase();
  // check if the user has a company
  const companyExist = await Company.findOne({ companyHR: req.authUser._id });
  if (!companyExist) return next(new AppError(messages.company.notExist, 404));
  // Check existence
  const jobExist = await Job.findOne({
    title,
    addedBy: req.authUser._id, // only check jobs created by the current user
  });
  if (jobExist) return next(new AppError(messages.job.alreadyExist, 409));
  // Prepare data
  const slug = slugify(title);
  const job = new Job({
    title,
    location,
    workingTime,
    seniorityLevel,
    description,
    technicalSkills: JSON.parse(technicalSkills),
    softSkills: JSON.parse(softSkills),
    company: company ? company._id : null
  });
  // add to db
  const createdJob = await job.save();
  await Company.findByIdAndUpdate(company, { $push: { jobs: job._id } });
  if (!createdJob) return next(new AppError(messages.job.failToCreate, 500));
  // Send response
  return res.status(201).json({
    message: messages.job.createdSuccessfully,
    success: true,
    data: createdJob,
  });
};

// update job
export const updateJob = async (req, res, next) => {  
  //get data from req
  const { id } = req.params;
  let {
    title,
    location,
    workingTime,
    seniorityLevel,
    description,
    technicalSkills,
    softSkills,
    company, 
  } = req.body;
  const authUserId = req.authUser._id;
  // Convert name to lowercase for consistency
    title = title.toLowerCase();
  // Check existence of the job
  const jobExist = await Job.findById(id);
  if (!jobExist) return next(new AppError(messages.job.notFound, 404));
  // check if the user is the owner of the job
  if (jobExist.addedBy.equals(authUserId)) return next(new AppError(messages.user.unauthorized, 403))
  // prepare data
  jobExist.title = title || jobExist.title;
  jobExist.location = location || jobExist.location;
  jobExist.workingTime = workingTime || jobExist.workingTime;
  jobExist.seniorityLevel = seniorityLevel || jobExist.seniorityLevel;
  jobExist.description = description || jobExist.description;
  jobExist.technicalSkills = technicalSkills || jobExist.technicalSkills;
  jobExist.softSkills = softSkills || jobExist.softSkills;
      // update db
  const updatedJob = await jobExist.save();
  if (!updatedJob) return next(new AppError(messages.job.failToUpdate, 500));
  // Send response
  return res.status(200).json({
    message: messages.job.updatedSuccessfully,
    success: true,
    data: updatedJob,
  });
};

// delete job
export const deleteJob = async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  const authUserId = req.authUser._id;
  // check existance
  const jobExist = await Job.findById(id);
  if (!jobExist) return next(new AppError(messages.job.notFound, 404));
  // check if the user is the owner of the job
  if (jobExist.addedBy.equals(authUserId)) return next(new AppError(messages.user.unauthorized, 403))
  // delete job
  const deletedJob = await Job.findByIdAndDelete(id);
  if (!deletedJob) return next(new AppError(messages.job.failToDelete, 409));
  // Delete related application on this job
  await Application.deleteMany({ jobId })
  // send res
  return res.status(200).json({
    message: messages.job.deletedSuccessfully,
    success: true,
    data: deletedJob,
  });
};

// Get all Jobs with their company’s information
export const getAllJobsWithCompany = async (req, res, next) => {
  const apiFeature = new ApiFeature(Job.find().populate('company'), req.query).pagination().sort().select().filter()
  const jobs = await apiFeature.mongooseQuery
  if (jobs.length == 0) return next(new AppError(messages.job.notExist, 500))
  // send res
  return res.status(200).json({
    message: messages.job.fetchedSuccessfully,
    success: true,
    data: jobs,
  });
};

// get specific job
export const getSpecificJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate({
    path: "company",
    // select: 'title location employmentType seniorityLevel description'
  });
  if (!job) {
    return next(new AppError(messages.job.notFound, 404));
  }
  // const jobs = await Job.find({ addedBy: req.user._id });
  return res.status(200).json({ success: true, data: job });
};

// get all Jobs for a specific company
export const getAllJobsForCompany = async (req, res, next) => {
  let { name } = req.query;
  companyName = companyName.toLowerCase()
  // Check if the company exists
  const companyExist = await Company.findById(name);
  if (!companyExist) return next(new AppError("Company not found", 404));
  // Find all jobs associated with the given company ID and populate company data if needed
  const jobs = await Job.find({ company: companyExist._id }).populate('addedBy', 'username')
  // send res
  return res.status(200).json({
    success: true,
    data: jobs,
  });
};

export const applyToJob = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.authUser._id;
  const { userTechSkills, userSoftSkills, userResume } = req.body;
  // Check job existence
  const jobExist = await Job.findById(jobId);
  if (!jobExist) return next(new AppError(messages.job.notExist, 404));
  // Check if the user has already applied to this job
  const userApplied = await Application.findOne({ userId, jobId });
  if (userApplied) return next(new AppError(messages.job.alreadyApplied, 400));
  // Upload file
  if (!req.file) return next(new AppError(messages.file.required, 400));
const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: '/Job Search App/resume'
})
  // Handle upload fail
  req.failResume = { secure_url, public_id };
  // Prepare data
  const application = new Application({
    jobId,
    userId,
    userTechSkills: JSON.parse(userTechSkills),
    userSoftSkills: JSON.parse(userSoftSkills),
    userResume: { secure_url, public_id },
  });
  // add to db
  const createdApplication = await application.save();
  if (!createdApplication) return next(new AppError(messages.job.failToApply, 500));
  // Send response
  return res.status(201).json({
    message: messages.job.createdApplication,
        success: true,
        data: createdApplication
  });
};

