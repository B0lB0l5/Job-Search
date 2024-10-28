import slugify from "slugify";
import { Company } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import cloudinary from "../../utils/cloud.js";

// add company
export const addCompany = async (req, res, next) => {
  // Get data from req
  let {
    name,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  name = name.toLowerCase();

  // Check existence
  const companyExist = await Company.findOne({ name });
  if (companyExist) {
    return next(new AppError(messages.company.alreadyExist, 409));
  }

  // Prepare data
  const slug = slugify(name);
  const company = new Company({
    name,
    slug,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  });

  // Add to DB
  const createdCompany = await company.save();
  if (!createdCompany) {
    return next(new AppError(messages.company.failToCreate, 500));
  }

  // Send response
  return res.status(201).json({
    message: messages.company.createdSuccessfully,
    success: true,
    data: createdCompany,
  });
};

// get specific company
export const getSpecificCompany = async (req, res, next) => {
    const { id } = req.params;
    const company = await Company.findById(id)
    .populate({
        path: "jobs" ,
        select: 'title location employmentType seniorityLevel description'
    });
  if (!company) {
    return next(new AppError(messages.company.notFound, 404));
  }
    // const jobs = await Job.find({ addedBy: req.user._id });
    return res.status(200).json({ success: true, data: company });
};

// update company
export const updateCompany = async (req, res, next) => {
    //get data from req
    const { id } = req.params;
    let {
        name,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
    } = req.body;

    // Convert name to lowercase for consistency
    if (name) {
        name = name.toLowerCase();
    }

    // Check existence of the company
    const companyExist = await Company.findById(id);
    if (!companyExist) {
        return next(new AppError(messages.company.notFound, 404));
    }

    // Update the existing company fields
    if (name) {
        const slug = slugify(name);
        companyExist.name = name;
        companyExist.slug = slug; // Update slug based on new name
    }
    if (description) companyExist.description = description;
    if (industry) companyExist.industry = industry;
    if (address) companyExist.address = address;
    if (numberOfEmployees) companyExist.numberOfEmployees = numberOfEmployees;
    if (companyEmail) companyExist.companyEmail = companyEmail;
    // Save the updated company
    const updatedCompany = await companyExist.save();
    if (!updatedCompany) {
        return next(new AppError(messages.company.failToUpdate, 500));
    }

    // Send response
    return res.status(200).json({
        message: messages.company.updatedSuccessfully,
        success: true,
        data: updatedCompany,
    });
};
// delete company
export const deleteCompany = async (req, res, next) => {
    //get data from req
    const { id } = req.params;
    // check existance
    const companyExist = await Company.findById(id);
    if (!companyExist) {
      return next(new AppError(messages.company.notFound, 404));
    }
    // delete from db
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return next(new AppError(messages.company.failToDelete, 409));
    }
    // send res
    return res.status(200).json({
      message: messages.company.deletedSuccessfully,
      success: true,
      data: deletedCompany,
    });
};

// search company by name 
export const searchCompanyByName = async (req, res, next) => {
    const { name } = req.query
    // Find the company by name (case-insensitive search)
    const company = await Company.findOne({ name: name.toLowerCase() });
    // If no company found, return 404
    if (!company) {
        return next(new AppError(messages.company.notFound, 404));
    }
    // Return the found company data
    return res.status(200).json({
        success: true,
        data: company,
    });

}

// Get all applications for specific Job
export const getApplicationJob = async (req, res, next) => {
  // get data from req
  const { jobId } = req.params;
  const userId = req.authUser._id;
  // cheke jobExist
  const jobExist = await Job.findById(jobId).populate('company')
  if (!jobExist) {
      return next(new APPError(messages.job.notExist, 404))
  }
  // ensure that the HR owns this job
  if (!jobExist.company.companyHR.equals(userId)) {
      return next(new APPError(messages.user.unauthorized, 403));
  }
  // all applications for this job
  const applications = await Application.find({ jobId }).populate('userId', '-password -__v -createdAt -updatedAt')
  // Check if there are applications
  if (applications.length === 0) {
      return next(new APPError(messages.application.notExist, 404))
  }
  // send res
  return res.status(200).json({
      message: messages.application.fetchedSuccessfully,
      success: true,
      data: applications
  })
}

// getApplicationsReport
export const getApplicationsReport = async (req, res, next) => {
  // get data from req
  const { companyId, date } = req.query;
  const userId = req.authUser._id;
  // Check if company exists
  const company = await Company.findById(companyId);
  if (!company) {
      return next(new APPError(messages.company.notExist, 404));
  }
  // check if the user is the owner of the company
  if (!company.companyHR.equals(userId)) {
      return next(new APPError(messages.user.unauthorized, 403));
  }
  // Fetch jobs for the company
  const jobs = await Job.find({ company: companyId });
  if (!jobs.length) {
      return next(new APPError(messages.job.notExist, 404));
  }

  // Get all jobIds for the company
  const jobIds = jobs.map(job => job._id);

  // Fetch applications for the company jobs on the specified day
  const applications = await Application.find({
      jobId: { $in: jobIds }, // Match any jobId from the company
      createdAt: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
  }).populate('userId', 'firstName lastName email')
      .populate('jobId', 'jobTitle')
  // Check if there are applications
  if (!applications.length) {
      return next(new APPError('No applications found on the specified day', 404));
  }
  // Convert data into a format suitable for Excel
  const data = applications.map(application => ({
      'User Name': `${application.userId.firstName} ${application.userId.lastName}`,
      'Email': application.userId.email,
      'Applied Job Title': application.jobId.jobTitle,
      'Application Date': application.createdAt.toDateString(),
      'User Resume': application.userResume.secure_url
  }));
  // Create Excel file using xlsx library
  const worksheet = xlsx.utils.json_to_sheet(data); // Convert JSON data to a worksheet
  const workbook = xlsx.utils.book_new(); // Create a new workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Applications'); // Append the worksheet to the workbook
  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
  // Send the file
  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.send(excelBuffer);
}