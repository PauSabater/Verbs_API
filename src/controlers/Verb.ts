import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Verb from '../models/Verb'
import { getTensesModes } from '../utils/utils'



const addDescription = async (req: Request, res: Response, next: NextFunction) => {

  const id = req.params;
  const description = req.body;


  try {
    const updatedRecord = await Verb.updateOne(
        { _id: id.verb },
        { $set: { 'descriptions.en': description.value } },
        {
            new: true,
            // upsert: true
        }
    )

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(updatedRecord);
  } catch (err) {
    console.error('error');
    console.error(err)
    res.status(500).send('Server Error');
  }
}

const renameProperties = async (req: Request, res: Response) => {
    try {

        const result = await Verb.updateMany(
        { 'data.tenses.conjunctive.konj_futur_II': { $exists: true } },
        { $rename: { 'data.tenses.conjunctive.konj_futur_II': 'data.tenses.conjunctive.konj_I_futur_II' } }
        );

        console.log(`${result.modifiedCount} documents updated`);

        res.send(`${result.modifiedCount} documents updated`);
    } catch (err) {
        console.error('Error updating documents:', err);
        res.status(500).send('Error updating documents');
    }
    }

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
        .limit(5)
        .then((verbs) => res.status(200).json({ verbs }))
        .catch((error) => res.status(500).json({ error }))
}

const getVerbsProperties = (req: Request, res: Response, next: NextFunction) => {
    let verbsQuery: string[] = []

    for (const key of Object.keys(req.query)) {
        verbsQuery.push(key || 'nothing')
    }

    if (verbsQuery.length === 0) return res.status(500).json({ message: 'no parameters were provided' })

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

const getRandomVerb = async (req: Request, res: Response, next: NextFunction) => {

    const levelsQuery = req.query.levels as string
    const levelsArray = levelsQuery
        ? levelsQuery.toUpperCase().split(',')
        : ''

    const typesQuery = req.query.types as string

    /* Available types:
        - regular
        - irregular
        - separable
        - inseparable
        - prefixed
        - modal
        - auxiliary
    */

    const typesArray = typesQuery ? typesQuery.split(',') : ''

    const queryMatch = {
        ...levelsArray
            && { "data.properties.level": { $in: levelsArray }},

        ...typesArray.includes('regular')
            && { "data.properties.isIrregular": false },

        ...typesArray.includes('irregular')
            && { "data.properties.isIrregular": true },

        ...typesArray.includes('separable')
            && { "data.properties.isSeparable": true },

        ...typesArray.includes('inseparable')
            && { "data.properties.isSeparable": false },

        ...typesArray.includes('prefixed')
            && { "data.properties.prefied": true },

        ...typesArray.includes('modal')
            && { "data.properties.isModal": true },
    }

    const pipeline = [
            {
                $match: queryMatch,
            },
            { $sample: { size: 1 } },
            { $project: {
                _id: 1,
                "data.properties": 1

            } }
        ]

    // res.json(levels)

    return Verb.aggregate(pipeline)
        .then((verbs) => (verbs.length
            ? res.status(200).json({ results: verbs[0] })
            : res.status(404).json({ message: req.params.verb + ' not found' })))
        .catch((error) => res.status(500).json({ error }))

}


const getTenseFromVerb = (req: Request, res: Response, next: NextFunction) => {

    const verbName = req.params.verb;
    // const verbModes = (req.query.mode as string).split(','); // Assuming `mode` is a comma-separated string of modes
    const verbTenses: string[] = (req.query.tenses as string).split(',') // Assuming `tense` is a comma-separated string of tenses
    const verbModes: string[] = getTensesModes(verbTenses)

    const query = {
        verb: new RegExp('^' + verbName)
    }

    // Construct the dynamic projection object
    const tensesProjection = {}
    verbModes.forEach(mode => {
        tensesProjection[mode] = {}
        verbTenses.forEach(tense => {
            tensesProjection[mode][tense] = `$data.tenses.${mode}.${tense}`;
        });
    });

    const pipeline = [
        {
            $match: query
        },
        {
            $project: {
                _id: 0,
                verb: 1,
                data: {
                    tenses: tensesProjection
                }
            }
        },
        {
            $limit: 1
        }
    ];

    return Verb.aggregate(pipeline)
        .then((verbs) => (verbs.length
            ? res.status(200).json({ verb: verbs[0] })
            : res.status(404).json({ message: req.params.verb + ' not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const getAllSeparablerVerbs = (req: Request, res: Response, next: NextFunction) => {

    const project = {
        _id: 1
    }

    const query = {
        "data.properties.isSeparable": true
        // data: {properties: { isSeparable: true}}
    }

    return Verb.find(query, project)
        .then((verb) => (verb
            ? res.status(200).json({ verb })
            : res.status(404).json({ message: req.query.verb + 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const readVerb = (req: Request, res: Response, next: NextFunction) => {
    const verbName = req.params.verb

    return Verb.findOne({ verb: verbName })
        .then((verb) => (verb
            ? res.status(200).json({ verb })
            : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const getVerbExists = (req: Request, res: Response, next: NextFunction) => {

    const verbName = req.params.verb

    const project = {
        _id: 1
    }

    const query = {
        "_id": verbName
    }

    return Verb.find(query, project)
        .then((data) => (data[0]
            ? res.status(200).json({ exists: true })
            : res.status(404).json({ exists: false }))
        )
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

export default { createVerb, readVerb, readAll, updateVerb, deleteVerb, getVerbSearchBar, getTenseFromVerb, getVerbsProperties, getAllSeparablerVerbs, getVerbExists, getRandomVerb, renameProperties, addDescription }
