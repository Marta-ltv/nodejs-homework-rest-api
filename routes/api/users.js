const express = require('express');

const { validateBody } = require('../../middlewares');

const { authSchemas } = require("../../models/user");

const ctrl = require("../../controllers/auth");


const router = express.Router();

// signup
router.post("/register", validateBody(authSchemas.registerSchema), ctrl.register);

// sign in
router.post("/login", validateBody(authSchemas.loginSchema), ctrl.login);

module.exports = router;

