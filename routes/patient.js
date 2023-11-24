const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);

router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.get('/:id', patientController.updatePatient);
router.get('/:id', patientController.deletePatient);
router.patch('/send-credentials', patientController.sendCredentials);

module.exports = router;
