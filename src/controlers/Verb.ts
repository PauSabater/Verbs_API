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
}

const getVerbsProperties = (req: Request, res: Response, next: NextFunction) => {
    let verbsQuery: string[] = []

    for (const key of Object.keys(req.query)) {
        verbsQuery.push(key || 'nothing')
    }

    if (verbsQuery.length === 0) return res.status(500).json({ message: 'no parameters were provided' })

    // const query = { $or: [{ verb: 'sein' }, { verb: 'sehen' }, { verb: 'haben' }] }

    const query = { verb: { $in: verbsQuery } }
    const project = {
        verb: 1,
        data: { properties: 1 }
    }

    return Verb.find(query, project)
        .then((verbs) => {
            const verbsProps = []
            verbs.forEach((verb) => {
                delete verb.data.tenses
                verbsProps.push({
                    verb: verb.verb,
                    properties: verb.data.properties
                })
            })
            res.status(200).json(verbsProps)
        })
        .catch((error) => res.status(500).json({ error }))
}

const readTenseFromVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbName = req.params.verb
    const verbMode: string = req.query.mode as string
    const verbTense = req.query.tense as string

    const project = {
        verb: 1,
        data: { tenses: { [verbMode]: { [verbTense]: { conjugations: 1 } } } }
    }

    const query = {
        verb: new RegExp('^' + verbName)
    }

    return Verb.find(query, project)
        .limit(1)
        .then((verb) => (verb ? res.status(200).json({ verb }) : res.status(404).json({ message: req.query.verb + 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const readVerb = (req: Request, res: Response, next: NextFunction) => {
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

export default { createVerb, readVerb, readAll, updateVerb, deleteVerb, getVerbSearchBar, readTenseFromVerb, getVerbsProperties }
