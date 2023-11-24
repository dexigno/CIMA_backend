const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);

router.post('/', patientController.createPatient);
router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.patch('/:id', patientController.updatePatient);
router.patch('/send-credentials', patientController.sendCredentials);

router.delete('/:id', patientController.deletePatient);

module.exports = router;
