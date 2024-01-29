import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IUser } from '../models/User'
import { Logging } from '../library/Logging'

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body)

            next()
        } catch (error) {
            Logging.error(error)

            return res.status(422).json({ error })
        }
    }
}

export const UserSchemas = {
    user: {
        create: Joi.object<IUser>({
            email: Joi.string().required(),
            password: Joi.string().required(),
            creationDate: Joi.date().required()
        }),
        update: Joi.object<IUser>({
            // verb: Joi.string().required(),
            // url: Joi.string().required()
        })
    }
}
