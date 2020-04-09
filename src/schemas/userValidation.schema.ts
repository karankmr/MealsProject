import * as Joi from '@hapi/joi';

const CreateUserSchema=Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),

  userName:Joi.string()
    .email({ minDomainSegments: 2})
    .required(),

  age:Joi.number()
    .min(0)
    .max(90)
    .required(),

  password: Joi.string()
    .min(5)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),

   maxCalorie:Joi.number().min(1000)
});



const LoginAuthCredentialSchema=Joi.object({
    userName: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  }
)



const UpdateUserSchema=Joi.object( {

  name:Joi.string()
    .min(3)
    .max(30),

  age:Joi.number()
    .min(0)
    .max(90),

  userName:Joi.string()
    .email({ minDomainSegments: 2})
    ,

  maxCalorie:Joi.number().min(1000),

  password: Joi.string()
    .min(5)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

})


export {CreateUserSchema,UpdateUserSchema,LoginAuthCredentialSchema};