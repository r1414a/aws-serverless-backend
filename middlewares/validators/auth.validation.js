import { body } from 'express-validator'

export const validateAdminLogin = [
    body('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage("Invalid email format"),
    body('password')
        .trim().notEmpty().withMessage("Password is required"),
]