const { Router } = require('express')
const { signin } = require('../controllers/authenticationController')

const router = Router()

router.post('/authentication', signin)

module.exports = router