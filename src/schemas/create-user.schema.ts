import * as Joi from '@hapi/joi'

const CreateUserSchema=Joi.object({

  name: Joi.string()
    .min(3)
    .max(30)
    .required(),

  userName:Joi.string()
    .email({ minDomainSegments: 2})
    .required(),

  password: Joi.string()
    .min(5)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
});
export {CreateUserSchema};