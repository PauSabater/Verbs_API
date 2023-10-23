import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IVerb } from '../models/Verb'
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

export const modeSchema = {
    tense: Joi.string().required(),
    conjugations: Joi.array().items({
        person: Joi.string().required(),
        conjugation: Joi.string().required(),
        conjugationHTML: Joi.string().required()
    })
}

export const Schemas = {
    verb: {
        create: Joi.object<IVerb>({
            verb: Joi.string().required(),
            url: Joi.string().required(),
            level: Joi.string().required(),
            order: Joi.number().required(),
            verbHTML: Joi.string().required(),
            stemFormationHTML: Joi.string().required(),
            isIrregular: Joi.boolean().required(),
            isSeparable: Joi.boolean().required(),
            modes: {
                indicative: Joi.array().items(modeSchema),
                conjunctive: Joi.array().items(modeSchema),
                conditionalOrConjunctiveII: Joi.array().items(modeSchema),
                imperative: Joi.array().items(modeSchema)
            }
        }),
        update: Joi.object<IVerb>({
            verb: Joi.string().required(),
            url: Joi.string().required()
        })
    }
}
