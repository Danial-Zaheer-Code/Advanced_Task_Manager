import express from "express"
import { check } from "express-validator"
import { validateRequest } from "../middleware/validator.js";
import { register, login, logout } from "../controllers/authController.js";

export const router = express.Router();

router.post('/register',
    check("email")
        .isEmail()
        .withMessage("Invalid Email")
        .normalizeEmail(),
    check("name")
        .notEmpty()
        .withMessage("Name is required")
        .trim()
        .escape(),
    check("phone")
        .isMobilePhone()
        .withMessage("Invalid Mobile Number"),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validateRequest,
    register
)

router.post('/',
    check("email")
        .isEmail()
        .withMessage("Invalid Email")
        .trim()
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    validateRequest,
    login
)

router.post('/logout',validateRequest, logout);