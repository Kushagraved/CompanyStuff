const express = require('express');
const { saveToDb, getTopRankedCompanies, updateCompany } = require('../controllers/apiController');
const router = express.Router();

// /api
router.post('/save', saveToDb);
router.get('/companies', getTopRankedCompanies);
router.patch('/company/:id', updateCompany);


module.exports = router;