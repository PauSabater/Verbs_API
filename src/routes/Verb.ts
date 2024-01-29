import express from 'express'
import controller from '../controlers/Verb'
import { Schemas, ValidateJoi } from '../middleware/Joi'

const router = express.Router()

router.post('/create', ValidateJoi(Schemas.verb.create), controller.createVerb)
router.get('/get/search/:verb', controller.getVerbSearchBar)
router.get('/get/:verbId', controller.readVerb)
router.get('/get/verb/:verb', controller.readVerbByString)
router.get('/get', controller.readAll)
router.patch('/update/:verbId', ValidateJoi(Schemas.verb.update), controller.updateVerb)
router.delete('/delete/:verbId', controller.deleteVerb)

export = router
