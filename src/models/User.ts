import mongoose, { Schema } from 'mongoose'

export interface IUser {
    _id: string
    email: string
    password: string
    creationDate: Date
    isVerified: boolean
    forgotPasswordToken?: string
    forgotPasswordTokenExpiry?: Date
    verifyToken?: string
    verifyTokenExpiry?: Date
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        // _id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        creationDate: { type: Date, required: true },
        isVerified: { type: Boolean, required: false },
        forgotPasswordToken: { type: String, required: false },
        forgotPasswordTokenExpiry: { type: Date, required: false },
        verifyToken: { type: String, required: false },
        verifyTokenExpiry: { type: String, required: false }
    },
    {
        _id: true,
        versionKey: false
    }
)

export default mongoose.model<IUserModel>('User', UserSchema)
