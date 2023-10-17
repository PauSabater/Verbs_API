import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Verb from '../models/Verb'

const createVerb = (req: Request, res: Response, next: NextFunction) => {
    const { verb } = req.body
    const { url } = req.body

    const verbData = new Verb({
        _id: new mongoose.Types.ObjectId(),
        verb,
        url
    })

    return verbData
        .save()
        .then((verb) => res.status(201).json({ verb }))
        .catch((error) => res.status(500).json({ error }))
}

const readVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbId = req.params.verbId

    return Verb.findById(verbId)
        .then((verb) => (verb ? res.status(200).json({ verb }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Verb.find()
        .then((verbs) => res.status(200).json({ verbs }))
        .catch((error) => res.status(500).json({ error }))
}

const updateVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbId = req.params.verbId

    return Verb.findById(verbId)
        .then((verb) => {
            if (verb) {
                verb.set(req.body)

                return verb
                    .save()
                    .then((verb) => res.status(201).json({ verb }))
                    .catch((error) => res.status(500).json({ error }))
            } else {
                return res.status(404).json({ message: 'not found' })
            }
        })
        .catch((error) => res.status(500).json({ error }))
}

const deleteVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbId = req.params.verbId

    return Verb.findByIdAndDelete(verbId)
        .then((verb) => (verb ? res.status(201).json({ verb, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

export default { createVerb, readVerb, readAll, updateVerb, deleteVerb }
