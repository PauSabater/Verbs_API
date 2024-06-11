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

export const conjugationSchema = () => ({
    conjugations: Joi.array().items({
        preconjugation: Joi.string(),
        preconjugationHTML: Joi.string(),
        person: Joi.string(),
        conjugation: Joi.string().required(),
        conjugationHTML: Joi.string().required()
    })
})

export const examplesByLangSchema = () => ({
    de: Joi.string(),
    en: Joi.string(),
    es: Joi.string(),
    fr: Joi.string()
})

export const examplesSchemaDefinition = () => ({
    indicative: {
        präsens: Joi.object({ ...examplesByLangSchema() }),
        präteritum: Joi.object({ ...examplesByLangSchema() }),
        perfekt: Joi.object({ ...examplesByLangSchema() }),
        plusquamperfekt: Joi.object({ ...examplesByLangSchema() }),
        futur_I: Joi.object({ ...examplesByLangSchema() }),
        futur_II: Joi.object({ ...examplesByLangSchema() })
    },
    infinitive: {
        partizip_II: Joi.object({ ...examplesByLangSchema() })
    },
    imperative: {
        präsens: Joi.object({ ...examplesByLangSchema() })
    },
    conjunctive: {
        konjunktiv_I: Joi.object({ ...examplesByLangSchema() }),
        konjunktiv_II: Joi.object({ ...examplesByLangSchema() })
    },
    conditional: {
        konjunktiv_I: Joi.object({ ...examplesByLangSchema() }),
        konjunktiv_II: Joi.object({ ...examplesByLangSchema() })
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
                    prefixed: Joi.boolean().optional(),
                    reflexive: Joi.boolean().optional(),
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
                    indicative: {
                        präsens: Joi.object({ ...conjugationSchema() }),
                        präteritum: Joi.object({ ...conjugationSchema() }),
                        perfekt: Joi.object({ ...conjugationSchema() }),
                        plusquam: Joi.object({ ...conjugationSchema() }),
                        futur_I: Joi.object({ ...conjugationSchema() }),
                        futur_II: Joi.object({ ...conjugationSchema() })
                    },
                    infinitive: {
                        infinitiv_I: Joi.object({ ...conjugationSchema() }),
                        infinitiv_II: Joi.object({ ...conjugationSchema() }),
                        partizip_I: Joi.object({ ...conjugationSchema() }),
                        partizip_II: Joi.object({ ...conjugationSchema() })
                    },
                    imperative: {
                        imperative: Joi.object({ ...conjugationSchema() })
                    },
                    conjunctive: {
                        konjunktiv_I: Joi.object({ ...conjugationSchema() }),
                        konjunktiv_II: Joi.object({ ...conjugationSchema() }),
                        konj_perfekt: Joi.object({ ...conjugationSchema() }),
                        konj_plusquam: Joi.object({ ...conjugationSchema() }),
                        konj_futur_I: Joi.object({ ...conjugationSchema() }),
                        konj_futur_II: Joi.object({ ...conjugationSchema() })
                    },
                    conditionalOrConjunctiveII: {
                        konjunktiv_II: Joi.object({ ...conjugationSchema() }),
                        konj_plusquam: Joi.object({ ...conjugationSchema() })
                    }
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
                    präsens: Joi.object({ ...examplesByLangSchema() }),
                    präteritum: Joi.object({ ...examplesByLangSchema() }),
                    perfekt: Joi.object({ ...examplesByLangSchema() }),
                    plusquamperfekt: Joi.object({ ...examplesByLangSchema() }),
                    futur_I: Joi.object({ ...examplesByLangSchema() }),
                    futur_II: Joi.object({ ...examplesByLangSchema() })
                },
                infinitive: {
                    partizip_II: Joi.object({ ...examplesByLangSchema() })
                },
                imperative: {
                    präsens: Joi.object({ ...examplesByLangSchema() })
                },
                conjunctive: {
                    konjunktiv_I: Joi.object({ ...examplesByLangSchema() }),
                    konjunktiv_II: Joi.object({ ...examplesByLangSchema() })
                },
                conditional: {
                    konjunktiv_I: Joi.object({ ...examplesByLangSchema() }),
                    konjunktiv_II: Joi.object({ ...examplesByLangSchema() })
                }
            }
        }),
        update: Joi.object<IVerb>({
            verb: Joi.string().required(),
            url: Joi.string().required()
        })
    }
}
