import { body } from 'express-validator'

export const validateProjectRequirement = [
    body('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage("Invalid email format"),
    body('mobileNumber')
        .trim().notEmpty().withMessage("Mobile number is required.")
        .isMobilePhone('en-IN').withMessage('Invalid mobile number'),
    body('name')
        .optional().trim().isLength({min: 2}).withMessage("Name must be at least 2 charactes.")
]