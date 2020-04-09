import * as Joi from '@hapi/joi'

const CreateMealsSchema=Joi.object({
  date: Joi.string().required(),
  time: Joi.string().required(),
  title: Joi.string().required(),
  calorie: Joi.number()
    .min(0),
  userId:Joi.number().required()
});
export {CreateMealsSchema};