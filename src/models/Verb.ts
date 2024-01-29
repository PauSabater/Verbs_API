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

const ModeSchema: Schema = new Schema(
    {
        tense: { type: String, required: true },
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
            'futur I': { type: ExamplesByLangSchema, required: false },
            'futur II': { type: ExamplesByLangSchema, required: false }
        },
        infinitive: {
            'partizip II': { type: ExamplesByLangSchema, required: false }
        },
        imperative: {
            präsens: { type: ExamplesByLangSchema, required: false }
        },
        conjunctive: {
            'Konjunktiv I': { type: ExamplesByLangSchema, required: false },
            'Konjunktiv II': { type: ExamplesByLangSchema, required: false }
        },
        conditional: {
            'Konjunktiv I': { type: ExamplesByLangSchema, required: false },
            'Konjunktiv II': { type: ExamplesByLangSchema, required: false }
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
                indicative: [{ type: [ModeSchema], required: true }],
                infinitive: [{ type: [ModeSchema], required: true }],
                imperative: [{ type: [ModeSchema], required: true }],
                conjunctive: [{ type: [ModeSchema], required: true }]
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
