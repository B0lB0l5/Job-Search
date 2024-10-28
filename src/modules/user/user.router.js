import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getProfileVal, RrecoveryEmailVal, updatePasswordVal, updateUserVal } from "./user.validation.js";
import { deleteUser, getProfile, getRecoveryEmailAccounts, getUser, updatePassword, updateUser } from "./user.controller.js";


const userRouter = Router();

// update user
/**
 * Updates a user's information.
 * @route PUT /user/update/:userId
 * @async
 * @function updateUser
 * @param {Object} req - The request object containing user ID and new data.
 * @param {Object} res - The response object to send back user update response.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the updated user details.
 */
userRouter.put('/update/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(updateUserVal),
    asyncHandler(updateUser)
)

// delete user
/**
 * Deletes the authenticated user's account.
  * @route /user/DELETE /delete
 * @async
 * @function deleteUser
 * @param {Object} req - The request object for user deletion.
 * @param {Object} res - The response object to send back deletion confirmation.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response indicating the deletion status.
 */
userRouter.delete('/delete',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    asyncHandler(deleteUser)
)

// getUser
/**
 * Retrieves the authenticated user's details.
 * @route GET /user/ 
 * @async
 * @function getUser
 * @param {Object} req - The request object for fetching user details.
 * @param {Object} res - The response object to send back user details.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the user's details.
 */
userRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    asyncHandler(getUser)
)

// getProfile
/**
 * Retrieves a user's profile by user ID.
 * @route GET /user/profile/:userId
 * @async
 * @function getProfile
 * @param {Object} req - The request object containing the user ID in the parameters.
 * @param {Object} res - The response object to send back user profile details.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with the user's profile details.
 */
userRouter.get('/profile/:userId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(getProfileVal),
    asyncHandler(getProfile)
)

// updatePassword
/**
 * Updates the authenticated user's password.
  * @route PATCH /user/update-password
 * @async
 * @function updatePassword
 * @param {Object} req - The request object containing old and new passwords.
 * @param {Object} res - The response object to send back password update confirmation.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response indicating the password update status.
 */
userRouter.patch('/update-password',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(updatePasswordVal),
    asyncHandler(updatePassword)
)

// Get all accounts associated with a specific recovery email
/**
 * Retrieves all accounts associated with a specific recovery email.
 * @route GET user/recovery-email/:recoveryEmail
 * @async
 * @function getRecoveryEmailAccounts
 * @param {Object} req - The request object containing recovery email in the parameters.
 * @param {Object} res - The response object to send back associated user accounts.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} JSON response with a list of users associated with the recovery email.
 */
userRouter.get('/recovery-email/:recoveryEmail',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.COMPANY_HR]),
    isValid(RrecoveryEmailVal),
    asyncHandler(getRecoveryEmailAccounts)
)



export default userRouter