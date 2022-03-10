const express = require('express');
const contactController = require('../controllers/contactController');
const { isAuth } = require('../middleware/middleware');

const router = express.Router();

router.post('/add', isAuth, contactController.addContact);
router.patch('/update', isAuth, contactController.updateContact);
router.delete('/delete', isAuth, contactController.deleteContact);
router.get('/', isAuth, contactController.getContacts);

module.exports = router;
