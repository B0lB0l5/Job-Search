import bcrypt from 'bcrypt'
import { Application, Company, Job, User } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// update user
export const updateUser = async (req, res, next) => {
    // get data from req
    const { userId } = req.params;
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
    const authUserId = req.authUser._id;
    // check user exist 
    const userExist = await User.findById(userId);
    if (!userExist) return next(new AppError(messages.user.notExist, 404));
    // check only the owner of the account can update his account data
    if (authUserId.toString() !== userId.toString()) return next(new AppError(messages.user.unauthorized, 401));
    // Check if email, mobile number, or recovery email already exists for another user
    const existingUser = await User.findOne({
        $or: [
            { email: email },
            { mobileNumber: mobileNumber },
            { recoveryEmail: recoveryEmail }
        ],
        _id: { $ne: authUserId }
    });

    if (existingUser) {
        return next(new AppError(messages.user.alreadyExist, 409));
    }
    // prepare data
    userExist.email = email || userExist.email
    userExist.mobileNumber = mobileNumber || userExist.mobileNumber
    userExist.recoveryEmail = recoveryEmail || userExist.recoveryEmail
    userExist.DOB = DOB || userExist.DOB
    userExist.lastName = lastName || userExist.lastName
    userExist.firstName = firstName || userExist.firstName
    // add to db
    const userUpdated = await userExist.save();
    // handel fail
    if (!userUpdated) {
        return next(new AppError(messages.user.failToUpdate, 500))
    }
    // send res 
    return res.status(200).json({
        message: messages.user.updated,
        success: true,
        data: userUpdated
    })
}

// delete user
export const deleteUser = async (req, res, next) => {
    // get data from req 
    const authUserId = req.authUser._id;
    // cheke exist and delete 
    const userdeleted = await User.findByIdAndDelete(authUserId)
    // handel fail
    if (!userdeleted) {
        return next(new AppError(messages.user.failToDelete, 500))
    }

    // Delete related documents in other collections
    await Application.deleteMany({ userId: authUserId }) // Delete applications related to the user
    await Job.deleteMany({ addedBy: authUserId }) // Delete job related to the user
    await Company.deleteMany({ companyHR: authUserId }) // Delete company related to the user

    // send res 
    return res.status(200).json({
        message: messages.user.deleted,
        success: true
    })
}

// getUser
export const getUser = async (req, res, next) => {
    // get data from req
    const authUserId = req.authUser._id;
    // check existence
    const userExist = await User.findById(authUserId)
    if (!userExist) {
        return next(new AppError(messages.user.notExist, 404))
    }
    // send res 
    return res.status(200).json({
        message: messages.user.fetchedSuccessfully,
        success: true,
        data: userExist
    })
}

// getProfile
export const getProfile = async (req, res, next) => {
    // get data from req
    const { userId } = req.params;
    // check existence
    const userExist = await User.findById(userId).select('-password')
    if (!userExist) {
        return next(new AppError(messages.user.notExist, 404))
    }
    // send res
    return res.status(200).json({
        message: messages.user.fetchedSuccessfully,
        success: true,
        data: userExist
    })
}

// updatePassword
export const updatePassword = async (req, res, next) => {
    // get data from req
    const authUserId = req.authUser._id;
    const { oldPassword, newPassword } = req.body;
    // check existence
    const userExist = await User.findById(authUserId)
    if (!userExist) {
        return next(new AppError(messages.user.notExist, 404))
    }
    // check old password
    const isMatch = bcrypt.compareSync(oldPassword, userExist.password)
    if (!isMatch) {
        return next(new AppError(messages.user.invalidPassword, 401))
    }
    // prepare date
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password
    userExist.password = hashedNewPassword;
    // save data
    const userUpdated = await userExist.save()
    // handel fail
    if (!userUpdated) {
        return next(new AppError(messages.user.updateFailed, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.user.passwordUpdated,
        success: true
    })
}

// Get all accounts associated to a specific recovery Email
export const getRecoveryEmailAccounts = async (req, res, next) => {
    // get data from req
    const { recoveryEmail } = req.params;
    // check existance
    const users = await User.find({ recoveryEmail })
    if (!users.length) {
        return next(new AppError(messages.user.noAccountsFound, 404));
    }
    // send res 
    return res.status(200).json({
        message: messages.user.fetchedSuccessfully,
        success: true,
        data: users
    })
}