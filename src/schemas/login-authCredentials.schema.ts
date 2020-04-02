import * as Joi from '@hapi/joi';

const LoginAuthCredentialSchema=Joi.object({
    userName: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  }
)
export {LoginAuthCredentialSchema}