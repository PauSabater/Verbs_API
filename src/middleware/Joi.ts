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
        person: Joi.string(),
        conjugation: Joi.string().required(),
        conjugationHTML: Joi.string().required()
    })
}

export const examplesByLangSchemaDefinition = () => ({
    de: Joi.string(),
    en: Joi.string(),
    es: Joi.string(),
    fr: Joi.string()
})

export const examplesSchemaDefinition = () => ({
    indicative: {
        präsens: Joi.object({ ...examplesByLangSchemaDefinition() }),
        präteritum: Joi.object({ ...examplesByLangSchemaDefinition() }),
        perfekt: Joi.object({ ...examplesByLangSchemaDefinition() }),
        plusquamperfekt: Joi.object({ ...examplesByLangSchemaDefinition() }),
        'futur I': Joi.object({ ...examplesByLangSchemaDefinition() }),
        'futur II': Joi.object({ ...examplesByLangSchemaDefinition() })
    },
    infinitive: {
        'partizip II': Joi.object({ ...examplesByLangSchemaDefinition() })
    },
    imperative: {
        präsens: Joi.object({ ...examplesByLangSchemaDefinition() })
    },
    conjunctive: {
        'Konjunktiv I': Joi.object({ ...examplesByLangSchemaDefinition() }),
        'Konjunktiv II': Joi.object({ ...examplesByLangSchemaDefinition() })
    },
    conditional: {
        'Konjunktiv I': Joi.object({ ...examplesByLangSchemaDefinition() }),
        'Konjunktiv II': Joi.object({ ...examplesByLangSchemaDefinition() })
    }
})

export const Schemas = {
    verb: {
        create: Joi.object<IVerb>({
            _id: Joi.string().required(),
            url: Joi.string().required(),
            verb: Joi.string().required(),
            data: {
                properties: {
                    level: Joi.string().required(),
                    verbHTML: Joi.string().required(),
                    stemFormationHTML: Joi.string().required(),
                    isIrregular: Joi.boolean().required(),
                    isSeparable: Joi.boolean().required(),
                    auxiliary: Joi.string().required(),
                    translations: {
                        en: Joi.string(),
                        es: Joi.string(),
                        fr: Joi.string(),
                        de: Joi.string()
                    },
                    isModal: Joi.boolean().required()
                },
                tenses: {
                    indicative: Joi.array().items(modeSchema),
                    infinitive: Joi.array().items(modeSchema),
                    imperative: Joi.array().items(modeSchema),
                    conjunctive: Joi.array().items(modeSchema),
                    conditionalOrConjunctiveII: Joi.array().items(modeSchema)
                }
            },
            descriptions: {
                en: Joi.string(),
                es: Joi.string(),
                fr: Joi.string(),
                de: Joi.string()
            },
            examples: {
                indicative: {
                    präsens: Joi.object({ ...examplesByLangSchemaDefinition() }),
                    präteritum: Joi.object({ ...examplesByLangSchemaDefinition() }),
                    perfekt: Joi.object({ ...examplesByLangSchemaDefinition() }),
                    plusquamperfekt: Joi.object({ ...examplesByLangSchemaDefinition() }),
                    'futur I': Joi.object({ ...examplesByLangSchemaDefinition() }),
                    'futur II': Joi.object({ ...examplesByLangSchemaDefinition() })
                },
                infinitive: {
                    'partizip II': Joi.object({ ...examplesByLangSchemaDefinition() })
                },
                imperative: {
                    präsens: Joi.object({ ...examplesByLangSchemaDefinition() })
                },
                conjunctive: {
                    'Konjunktiv I': Joi.object({ ...examplesByLangSchemaDefinition() }),
                    'Konjunktiv II': Joi.object({ ...examplesByLangSchemaDefinition() })
                },
                conditional: {
                    'Konjunktiv I': Joi.object({ ...examplesByLangSchemaDefinition() }),
                    'Konjunktiv II': Joi.object({ ...examplesByLangSchemaDefinition() })
                }
            }
        }),
        update: Joi.object<IVerb>({
            verb: Joi.string().required(),
            url: Joi.string().required()
        })
    }
}
