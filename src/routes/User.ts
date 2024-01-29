import express from 'express'
import controller from '../controlers/User'
import { UserSchemas, ValidateJoi } from '../middleware/JoiUser'

const router = express.Router()

router.post('/create', ValidateJoi(UserSchemas.user.create), controller.createUser)
router.get('/user', controller.loggedUser)
router.get('/get/user/:email', controller.readUser)
router.post('/login', controller.loginUser)
// router.get('/get', controller.readAll)
// router.patch('/update/:verbId', ValidateJoi(Schemas.verb.update), controller.updateVerb)
router.delete('/delete/:email', controller.deleteUser)

export = router
