import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { forgotPassword, login, resetPassword, signup, verifyAccount } from "./auth.controller.js";
import { forgetPasswordVal, loginValidation, resetPasswordVal, signupValidation } from "./auth.validation.js";

const authRouter = Router();

/**
 * User signup.
 * 
 * @async
 * @function signup
 * @description Registers a new user by creating an account with the provided details. The user's password is hashed, and an email is sent to verify the account. This function ensures that the email and mobile number are unique before creating the user.
 * @param {Object} req - Express request object containing user registration details (first name, last name, email, password, mobile number, recovery email, DOB).
 * @param {Object} res - Express response object to send back the result of the user creation process.
 * @param {Function} next - Express middleware to handle errors.
 * @returns {Object} JSON response with user creation confirmation or error message.
 */
authRouter.post("/signup", isValid(signupValidation), asyncHandler(signup));

/**
 * Verify account via email token.
 * 
 * @async
 * @function verifyAccount
 * @description Verifies a user's email address by validating the token sent during registration. This function updates the user's account status to verified.
 * @param {Object} req - Express request object containing the token in the URL parameters.
 * @param {Object} res - Express response object to send back the result of the verification process.
 * @param {Function} next - Express middleware to handle errors.
 * @returns {Object} JSON response confirming account verification or an error message.
 */
authRouter.get('/verify/:token', asyncHandler(verifyAccount));

/**
 * User login.
 * 
 * @async
 * @function login
 * @description Authenticates the user using email, mobile number, or recovery email and password. If successful, a session token is generated. The function also checks if the user is verified and updates the user's status to online upon successful login.
 * @param {Object} req - Express request object containing user credentials (email, mobile number, recovery email, and password).
 * @param {Object} res - Express response object to send back login status and token if successful.
 * @param {Function} next - Express middleware to handle errors.
 * @returns {Object} JSON response with authentication token and success message, or error message if authentication fails.
 */
authRouter.post('/login', isValid(loginValidation), asyncHandler(login))


/**
 * Forgot password.
 * 
 * @async
 * @function forgotPassword
 * @description Sends an OTP (one-time password) to the user's email address to enable password recovery. The OTP is stored in the user's record with an expiration time.
 * @param {Object} req - Express request object containing the user's email address.
 * @param {Object} res - Express response object to confirm the OTP has been sent.
 * @param {Function} next - Express middleware to handle errors.
 * @returns {Object} JSON response confirming the OTP has been sent or an error message.
 */
authRouter.post('/forget-password',
    isValid(forgetPasswordVal),
    asyncHandler(forgotPassword)
)

/**
 * Reset password using OTP.
 * 
 * @async
 * @function resetPassword
 * @description Resets the user's password using the OTP sent during the "forgot password" process. The OTP is validated, and if valid, the user's password is updated after hashing.
 * @param {Object} req - Express request object containing the user's email, OTP, and new password.
 * @param {Object} res - Express response object confirming password reset or returning an error message.
 * @param {Function} next - Express middleware to handle errors.
 * @returns {Object} JSON response confirming the password has been updated or an error message.
 */
authRouter.patch('/reset-password',
    isValid(resetPasswordVal),
    asyncHandler(resetPassword)
)

export default authRouter;
