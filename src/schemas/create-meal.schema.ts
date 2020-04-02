import * as Joi from '@hapi/joi'

const CreateMealsSchema=Joi.object({
  // id: Joi.number().required(),
  date: Joi.string(),
  time: Joi.string(),
  title: Joi.string(),
  calorie: Joi.number(),
  userId:Joi.number()
});
export {CreateMealsSchema};