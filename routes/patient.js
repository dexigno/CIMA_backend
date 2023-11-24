const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients');
const { authProtect } = require('../middleware/authProtect');

router.use(authProtect);

router.post('/', patientController.createPatient);

module.exports = router;
