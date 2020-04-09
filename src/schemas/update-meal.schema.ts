import * as Joi from '@hapi/joi'

const UpdateMealSchema=Joi.object({
  status:Joi.string(),
  date:Joi.string(),
  time:Joi.string(),
  title: Joi.string(),
  calorie: Joi.number()
    .min(1),
  userId:Joi.number(),
});
export {UpdateMealSchema};