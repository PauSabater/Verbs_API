import { NextFunction, Request, Response } from 'express'
import mongoose, { Schema } from 'mongoose'
import Verb from './Verb'

export interface IVerb {
    verb: string
    url: string
    level: string
    order: number
    verbHTML: string
    stemFormationHTML: string
    isIrregular: boolean
    isSeparable: boolean
    modes: {
        indicative: IMode[]
        conjunctive: [IMode]
        conditionalOrConjunctiveII: [IMode]
        imperative: [IMode]
    }
}

export interface IMode {
    tense: string
    conjugations: [
        {
            person: string
            conjugation: string
            conjugationHTML: string
        }
    ]
}

export interface IVerbModel extends IVerb, Document {}

const ModeSchema: Schema = new Schema(
    {
        tense: { type: String, required: true },
        conjugations: [
            {
                person: { type: String, required: true },
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

const VerbSchema: Schema = new Schema(
    {
        url: { type: String, required: true },
        verb: { type: String, required: true },
        level: { type: String, required: true },
        order: { type: Number, required: true },
        verbHTML: { type: String, required: true },
        stemFormationHTML: { type: String, required: true },
        isIrregular: { type: Boolean, required: true },
        isSeparable: { type: Boolean, required: true },
        modes: {
            indicative: [{ type: [ModeSchema], required: true }],
            conjunctive: [{ type: [ModeSchema], required: true }],
            conditionalOrConjunctiveII: [{ type: [ModeSchema], required: true }],
            imperative: [{ type: [ModeSchema], required: true }]
        }
    },
    {
        versionKey: false
    }
)

export default mongoose.model<IVerbModel>('Verb', VerbSchema)
