import { NextFunction, Request, Response } from 'express'
import mongoose, { Schema } from 'mongoose'
import Verb from './Verb'

export interface IVerb {
    verb: string
    url: string
}

export interface IVerbModel extends IVerb, Document {}

const VerbSchema: Schema = new Schema(
    {
        url: { type: String, required: true },
        verb: { type: String, required: true }
    },
    {
        versionKey: false
    }
)

export default mongoose.model<IVerbModel>('Verb', VerbSchema)
