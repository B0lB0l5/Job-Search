import bcrypt from "bcrypt";
import { User } from "../../../database/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { generateToken, verifyToken } from "../../utils/token.js";
import { sendEmail } from "../../utils/email.js";
import { status } from "../../utils/constant/enum.js";
import { generateOTP, sendOTP } from "../../utils/OTP.js";

// signup
export const signup = async (req, res, next) => {
  // get data from req
  let { firstName, lastName, email, password, recoveryEmail, DOB, phone } =
    req.body;
  // check exitance
  const userExist = await User.findOne({ $or: [{ email }, { phone }] }); // {}, null
  if (userExist) return next(new AppError(messages.user.alreadyExist, 409));
  // prepare data
  // --hash password
  password = bcrypt.hashSync(password, 8);
  // Concatenate firstName and lastName to create the username
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  // --create user
  const user = new User({
    firstName,
    lastName,
    username,
    email,
    password,
    recoveryEmail,
    DOB,
    phone,
    status: status.OFFLINE, // Set initial status to OFFLINE
  });
  // add to database
  const createdUser = await user.save();
  if (!createdUser) return next(new AppError(messages.user.failToCreate, 500));
  // generate token
  const token = generateToken({ payload: { email } });
  const verifyUrl = `${req.protocol}://${req.headers.host}/auth/verify/${token}`;
  // send email
  const emailContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #6f42c1;  /* Purple color */
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background-color: #6f42c1;  /* Purple color */
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #5a34a1;  /* Darker purple on hover */
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            padding: 10px;
            margin-top: 20px;
            border-top: 1px solid #dddddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <div class="content">
            <p>Hello ${firstName},</p>
            <p>We're thrilled to have you with us! Please click the button below to verify your email address and activate your account:</p>
            <a href="${verifyUrl}" class="button">Verify Your Email</a>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 Our Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
  await sendEmail({
    to: email,
    subject: "please verify your account",
    html: emailContent,
  });
  // send res
  return res.status(201).json({
    message: messages.user.createdSuccessfully,
    success: true,
    data: createdUser,
  });
};

// verify account
export const verifyAccount = async (req, res, next) => {
  // get data from req
  const { token } = req.params;
  // check token
  const payload = verifyToken({ token });
  const user = await User.findOneAndUpdate(
    { email: payload.email },// Find user by email and unverified status
    { verified: true }, // Update the 'verified' status
    { new: true }  // Return the updated user document after the update
  );
  // check user exist
  if (!user) return next(new AppError(messages.user.notFound, 404));
//   user = User.save()
  return res
    .status(200)
    .json({ message: messages.user.verified, success: true });
};

// login
export const login = async (req, res, next) => {
  // get data from req
  const { email, recoveryEmail, phone, password } = req.body;
  // check user exist and update status online
  const userExist = await User.findOne(
    { $or: [{ email }, { phone }, { recoveryEmail }] },
    { status: status.ONLINE },
    { new: true }
  ).select('verified password');
  if (!userExist) return next(new AppError(messages.user.inValidCredentials, 400));
  // Check if user is verified
  if (!userExist.verified) return next(new AppError(messages.user.notVerified, 403));
  // check password
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) return next(new AppError(messages.user.inValidCredentials, 400));
  // generate token
  const token = generateToken({ payload: { _id: userExist._id, email: userExist.email } });
  // send res
  return res.status(200).json({
    message: "login Successfully",
    success: true,
    token,
  });
};

// forget password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new APPError(messages.user.invalidCredntiols, 401));
    }
    const otp = generateOTP(); // Function to generate OTP
    await sendOTP(user.email, otp); // Send OTP via email
    user.otp = otp; // Save OTP to user record
    user.otpExpires = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();
    return res.status(200).json({ message: 'OTP sent to your email', success: true });
};

// reset password
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new APPError(messages.user.notExist, 404));
    }

    // Check if the OTP is valid
    if (user.otp !== otp || Date.now() > user.otpExpires) {
        return next(new APPError(messages.user.invalidOTP, 400));
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update the user's password
    user.password = hashedPassword;

    // Clear the OTP and its expiration
    user.otp = undefined;
    user.otpExpires = undefined;

    // Save the user with the updated password
    const updatedUser = await user.save();

    if (!updatedUser) {
        return next(new APPError(messages.user.failToUpdatePassword, 500));
    }

    // Send response
    return res.status(200).json({
        message: messages.user.passwordUpdated,
        success: true,
    });
};

