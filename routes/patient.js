const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);

router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.patch('/send-credentials', patientController.sendCredentials);

module.exports = router;
