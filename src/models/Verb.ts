import mongoose, { Schema } from 'mongoose'

type TTense = 'präsens' | 'präteritum' | 'perfekt' | 'plusquamperfekt' | 'futur I' | 'futur II' | 'partizip I' | 'Konjunktiv I' | 'Konjunktiv II'
type TMode = 'indicative' | 'infinitive' | 'imperative' | 'conditionalOrConjunctiveII' | 'conjunctive I'

export interface IVerb {
    _id: string
    url: string
    verb: string
    data: {
        properties: {
            level: string
            verbHTML: string
            stemFormationHTML: string
            isIrregular: boolean
            isSeparable: boolean
            auxiliary: string
            translations: {
                en: string
                es: string
                fr: string
                de: string
            }
            isModal: boolean
        }
        tenses: {
            indicative: IMode
            infinitive: IMode
            imperative: IMode
            conjunctive: IMode
        }
    }
    descriptions?: {
        en?: string
        es?: string
        fr?: string
        de?: string
    }
    examples?: IModeExamples
}

export interface IMode {
    tense: string
    conjugations: [
        {
            person?: string
            conjugation: string
            conjugationHTML: string
        }
    ]
}

export type IModeExamples = {
    [key in TMode]: {
        [key in TTense]: {
            en?: string
            es?: string
            fr?: string
            de?: string
        }
    }
}

export interface IVerbModel extends IVerb, Document {}

const ConjugationSchema: Schema = new Schema(
    {
        conjugations: [
            {
                person: { type: String, required: false },
                conjugation: { type: String, required: true },
                conjugationHTML: { type: String, required: true }
            }
        ]
    },
    {
        _id: false,
        versionKey: false
    }
)

const ExamplesByLangSchema: Schema = new Schema(
    {
        de: { type: String, required: false },
        en: { type: String, required: false },
        es: { type: String, required: false },
        fr: { type: String, required: false }
    },
    {
        _id: false,
        versionKey: false
    }
)

const ExamplesSchema: Schema = new Schema(
    {
        indicative: {
            präsens: { type: ExamplesByLangSchema, required: false },
            präteritum: { type: ExamplesByLangSchema, required: false },
            perfekt: { type: ExamplesByLangSchema, required: false },
            plusquamperfekt: { type: ExamplesByLangSchema, required: false },
            futur_I: { type: ExamplesByLangSchema, required: false },
            futur_II: { type: ExamplesByLangSchema, required: false }
        },
        infinitive: {
            partizip_II: { type: ExamplesByLangSchema, required: false }
        },
        imperative: {
            präsens: { type: ExamplesByLangSchema, required: false }
        },
        conjunctive: {
            konjunktiv_I: { type: ExamplesByLangSchema, required: false },
            konjunktiv_II: { type: ExamplesByLangSchema, required: false }
        },
        conditional: {
            konjunktiv_I: { type: ExamplesByLangSchema, required: false },
            konjunktiv_II: { type: ExamplesByLangSchema, required: false }
        }
    },
    {
        _id: false,
        versionKey: false
    }
)

const VerbSchema: Schema = new Schema(
    {
        _id: { type: String, required: true, unique: true },
        url: { type: String, required: true, unique: true },
        verb: { type: String, required: true, unique: true },
        data: {
            properties: {
                level: { type: String, required: true },
                verbHTML: { type: String, required: true },
                stemFormationHTML: { type: String, required: true },
                isIrregular: { type: Boolean, required: true },
                isSeparable: { type: Boolean, required: true },
                auxiliary: { type: String, required: true },
                translations: {
                    en: { type: String, required: true },
                    es: { type: String, required: true },
                    fr: { type: String, required: true },
                    de: { type: String, required: true }
                },
                isModal: { type: Boolean, required: true }
            },
            tenses: {
                indicative: {
                    präsens: { type: [ConjugationSchema], required: true },
                    präteritum: { type: [ConjugationSchema], required: true },
                    perfekt: { type: [ConjugationSchema], required: true },
                    plusquam: { type: [ConjugationSchema], required: true },
                    futur_I: { type: [ConjugationSchema], required: true },
                    futur_II: { type: [ConjugationSchema], required: true }
                },
                infinitive: {
                    infinitiv_I: { type: [ConjugationSchema], required: true },
                    infinitiv_II: { type: [ConjugationSchema], required: true },
                    partizip_I: { type: [ConjugationSchema], required: true },
                    partizip_II: { type: [ConjugationSchema], required: true }
                },
                imperative: {
                    imperative: { type: [ConjugationSchema], required: true }
                },
                conditionalOrConjunctiveII: {
                    konjunktiv_II: { type: [ConjugationSchema], required: true },
                    konj_plusquam: { type: [ConjugationSchema], required: true }
                },
                conjunctive: {
                    konjunktiv_I: { type: [ConjugationSchema], required: true },
                    konjunktiv_II: { type: [ConjugationSchema], required: true },
                    konj_perfekt: { type: [ConjugationSchema], required: true },
                    konj_plusquam: { type: [ConjugationSchema], required: true },
                    konj_futur_I: { type: [ConjugationSchema], required: true },
                    konj_futur_II: { type: [ConjugationSchema], required: true }
                }
            }
        },
        descriptions: {
            en: { type: String, required: false },
            es: { type: String, required: false },
            fr: { type: String, required: false },
            de: { type: String, required: false }
        },
        examples: { type: ExamplesSchema, required: false }
    },
    {
        versionKey: false
    }
)

export default mongoose.model<IVerbModel>('Verb', VerbSchema)
