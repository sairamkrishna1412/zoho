const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post('/add', contactController.addContact);
router.patch('/update', contactController.updateContact);
router.delete('/delete', contactController.deleteContact);

module.exports = router;
