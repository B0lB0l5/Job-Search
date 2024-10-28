import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signupValidation = joi.object({
    firstName: generalFields.name.required(),
    lastName: generalFields.name.required(),
    email: generalFields.email.required(),
    recoveryEmail: generalFields.email.required(),
    password: generalFields.password.required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB,
    role: generalFields.role

})

export const loginValidation = joi.object({
    phone: generalFields.phone.optional(),
    email: generalFields.email.optional(),
    recoveryEmail: generalFields.email.optional(),
    password: generalFields.password.required()
}).xor('phone', 'email', 'recoveryEmail'); 

export const forgetPasswordVal = joi.object({
    email: generalFields.email.required()
})

export const resetPasswordVal = joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    newPassword: generalFields.password.required(),
    cPassword: generalFields.password.required().valid(joi.ref('newPassword')).required()
});