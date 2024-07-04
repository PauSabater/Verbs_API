import express from 'express'
import controller from '../controlers/Verb'
import { Schemas, ValidateJoi } from '../middleware/Joi'

const router = express.Router()

router.post('/create', ValidateJoi(Schemas.verb.create), controller.createVerb)
router.get('/get/search/:verb', controller.getVerbSearchBar)
router.get('/get/props/', controller.getVerbsProperties)
router.get('/get/verb/:verb', controller.readVerb)
router.get('/get/random-verb', controller.getRandomVerb)
router.get('/get/tenses/:verb', controller.getTenseFromVerb)
router.get('/get', controller.readAll)
router.get('/get/exists/:verb', controller.getVerbExists)
router.get('/get/separable', controller.getAllSeparablerVerbs)

router.put('/put/description/:verb', controller.addDescription)

router.patch('/update/:verbId', ValidateJoi(Schemas.verb.update), controller.updateVerb)
router.delete('/delete/:verbId', controller.deleteVerb)

// router.get('/get/rename', controller.renameProperties)

export = router
