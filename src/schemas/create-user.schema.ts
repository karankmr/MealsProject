import * as Joi from '@hapi/joi'

const CreateUserSchema=Joi.object({
  id: Joi.number().required(),
  name: Joi.string(),
  username:Joi.string(),
  password:Joi.string()
});
export {CreateUserSchema};