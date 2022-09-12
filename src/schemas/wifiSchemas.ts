import joi from "joi";

const wifiSchema = joi.object({
    title: joi.string().max(50).trim().required(),
    wifiName: joi.string().max(50).trim().required(),
    password: joi.string().min(8).trim().required()
});

export { wifiSchema };