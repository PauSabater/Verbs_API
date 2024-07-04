import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import UserSchema from '../models/User'
import bcrypt from 'bcrypt'
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')

// https://www.mongodb.com/community/forums/t/email-confirmation-script-for-user-authentication-via-email-address/13905/10
// https://www.mongodb.com/developer/products/atlas/email-password-authentication-app-services/
// https://www.youtube.com/watch?v=IxcKMcsBGE8&list=PLlameCF3cMEs0NQhLQtTdbL1VEfD1tK7Y

const jwtCookieName = 'jwt'

const cookieSecret = 'secret'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, creationDate, isVerified } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = new UserSchema({
        email,
        password: hashedPassword,
        creationDate,
        isVerified
    })

    return userData
        .save()
        .then((user) => res.status(201).json({ message: 'user created successfully' }))
        .catch((error) => {
            console.log('ERROR, USER NOT CREATED')
            res.status(500).json({ error })
        })
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    // const { email, body } = req.body

    try {
        const { email, password } = req.body

        const user = await UserSchema.findOne({ email: email })

        if (!user) return res.status(404).json({ message: `user email not found for ${req.params.email}` })

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch)
            return res.status(400).json({
                message: `invalid user password from ${password} to ${user.password}`
            })

        const token = jwt.sign({ _id: user._id }, cookieSecret)
        const options = {
            httpOnly: true, // should be to true
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: true,
            SameSite: 'None' // should be none
        }

        res.cookie(jwtCookieName, token, options)

        const userResp = {
            _id: user._id,
            email: user.email,
            creationDate: user.creationDate
        }

        res.status(200).json({ userResp })
    } catch (error) {
        res.status(500).json({ error })
    }
}

const readUser = (req: Request, res: Response, next: NextFunction) => {
    return UserSchema.findOne({ email: req.params.email })
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'user not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const loggedUser = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    const cookie = req.cookies['jwt']

    if (!cookie) return res.status(401).send({ message: 'no cookie found' })
    // res.status(200).json({ message: 'cookies found!!' })

    const claims = jwt.verify(cookie, cookieSecret)
    if (!claims) return res.status(401).send({ message: 'unauthenticated' })

    const user = await UserSchema.findOne({ _id: claims._id })
    if (!user) return res.status(401).send({ message: 'error finding user from cookie parsing' })

    // Remove password to send on response
    const { password, ...data } = await user.toJSON()

    res.status(200).json({ data })

    return UserSchema.findOne({ email: req.params.email })
        .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: 'user not found' })))
        .catch((error) => res.status(500).json({ error }))
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    // const verbId = req.params.verbId
    // return Verb.findById(verbId)
    //     .then((verb) => {
    //         if (verb) {
    //             verb.set(req.body)
    //             return verb
    //                 .save()
    //                 .then((verb) => res.status(201).json({ verb }))
    //                 .catch((error) => res.status(500).json({ error }))
    //         } else {
    //             return res.status(404).json({ message: 'not found' })
    //         }
    //     })
    //     .catch((error) => res.status(500).json({ error }))
}

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.email

    return UserSchema.findByIdAndDelete(userId)
        .then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }))
}

export default { createUser, readUser, updateUser, deleteUser, loginUser, loggedUser }
