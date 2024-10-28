import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const updateUserVal = joi.object({
    userId: generalFields.objectId.required(),
    firstName: generalFields.name.optional(),
    lastName: generalFields.name.optional(),
    email: generalFields.email.optional(),
    phone: generalFields.phone.optional(),
    recoveryEmail: generalFields.email.optional(),
    DOB: generalFields.DOB.optional()
})

export const getProfileVal = joi.object({
    userId: generalFields.objectId.required()
})

export const updatePasswordVal = joi.object({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.required().not(joi.ref('oldPassword')),
    cPassword: generalFields.password.required().valid(joi.ref('newPassword'))
})

export const RrecoveryEmailVal = joi.object({
    recoveryEmail: generalFields.email.required()
})