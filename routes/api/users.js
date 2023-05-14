const express = require('express');

const { validateBody, authenticate } = require('../../middlewares');

const { authSchemas } = require("../../models/user");

const ctrl = require("../../controllers/auth");


const router = express.Router();

// signup
router.post("/register", validateBody(authSchemas.registerSchema), ctrl.register);

// sign in
router.post("/login", validateBody(authSchemas.loginSchema), ctrl.login);


router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars",authenticate);

module.exports = router;

