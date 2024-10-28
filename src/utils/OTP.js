import { customAlphabet } from "nanoid";
import { sendEmail } from "./email.js";

export const generateOTP = customAlphabet("0123456789", 6)

export const sendOTP = async (email, otp) => {
    const mailOptions = await sendEmail({
        to: email,
        subject: "Your OTP Code",
        html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    })
};