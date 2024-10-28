const generateMessages = (entity) => ({
  alreadyExist: `${entity} Already Exist`,
  notFound: `${entity} Not Found`,
  createdSuccessfully: `${entity} Created Successfully`,
  updatedSuccessfully: `${entity} Updated Successfully`,
  deletedSuccessfully: `${entity} Deleted Successfully`,
  failToCreate: `Fail to create ${entity}`,
  failToUpdate: `Fail to Update ${entity}`,
  failToDelete: `Fail to Delete ${entity}`,
  invalidRequest: "Invalid request",
});

export const messages = {
  file: { required: 'file is required' },
  company: {
    ...generateMessages('company'),
    userHaveCompany: "user have alearedy company"
},
  job: { ...generateMessages('job'),
    createdApplication: "Application submitted successfully.",
    alreadyApplied: "You have already applied for this job.",
    failToApply: "Failed to submit your application.",
},
  user: {
    ...generateMessages("User"),
    verified: "user verified successfully",
        inValidCredentials: "invalid Credntiols",
        notVerified: "not Verified",
        loginSuccessfully: "login successfully",
        unauthorized: "unauthorized to access this api",
        invalidPassword: "invalid password",
        passwordUpdated: "password updated successfully",
        invalidOTP: "invalid OTP",
        failToUpdatePassword: "fail To Update Password",
        noAccountsFound: "no accounts found",
  },
  application: generateMessages('application'),
};
