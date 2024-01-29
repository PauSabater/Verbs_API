import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Verb from '../models/Verb'

const createVerb = (req: Request, res: Response, next: NextFunction) => {
    const { verb, url, data, descriptions, examples } = req.body

    const verbData = new Verb({
        _id: verb,
        verb,
        url,
        data,
        descriptions,
        examples
    })

    return verbData
        .save()
        .then((verb) => res.status(201).json({ verb }))
        .catch((error) => {
            console.log('ERRORS, VERB NOT CREATED')
            res.status(500).json({ error })
        })
}

const readVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbId = req.params.verbId

    return Verb.findById(verbId)
        .then((verb) => (verb ? res.status(200).json({ verb }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const getVerbSearchBar = (req: Request, res: Response, next: NextFunction) => {
    const verbName = req.params.verb

    const query = { verb: new RegExp('^' + verbName) }
    const project = {
        verb: 1,
        data: { properties: { level: 1 } }
    }

    return Verb.find(query, project)
        .limit(10)
        .then((verbs) => res.status(200).json({ verbs }))
        .catch((error) => res.status(500).json({ error }))
    // .project({ verb: 1 })

    // return Verb.find({
    //     verb: verbName
    // }).project({ item: 1, status: 1 })
}

const readVerbByString = (req: Request, res: Response, next: NextFunction) => {
    const verbName = req.params.verb

    return Verb.findOne({ verb: verbName })
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

export default { createVerb, readVerb, readAll, updateVerb, deleteVerb, readVerbByString, getVerbSearchBar }
