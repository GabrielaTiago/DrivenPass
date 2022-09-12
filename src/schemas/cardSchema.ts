import joi from "joi";

const cardSchema = joi.object({
    nickname: joi.string().max(20).trim().required(),
    printedName: joi.string().trim().max(50).uppercase().regex(/^[A-Z\s]+$/).required(),
    number: joi.string().trim().min(16).regex(/^[0-9]+$/).required(),
    cvv: joi.string().min(3).max(3).regex(/^[0-9]+$/).required(),
    expirationDate: joi.string().trim().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/).required(),
    password: joi.string().trim().min(4).max(6).regex(/^[0-9]+$/).required(),
    virtual: joi.boolean().required(),
    type: joi.string().trim().valid("credit", "debit", "both").required()
});

export { cardSchema };