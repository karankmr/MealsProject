import * as Joi from '@hapi/joi';
import EUserIAm from '../enums/user-role.enum';


const AuthCredentialSchema=Joi.object({
    userName: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),

  name: Joi.string()
      .min(3)
      .max(30)
      .required(),

  iAm: Joi.string().allow(...Object.values(EUserIAm)).required()

  }
)
export {AuthCredentialSchema}