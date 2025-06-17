const express = require('express');
const UserController = require('../controllers/userController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateUser, UserController.createOrFindUser);

module.exports = router;
