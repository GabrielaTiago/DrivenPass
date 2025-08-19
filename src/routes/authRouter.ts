import { Router } from 'express';

import { signIn, signUp } from '../controllers/authController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { schemas } from '../schemas/schemas';

const authRouter = Router();

/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user with email and password, returning a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Authentication Success"
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW9AZXhlbXBsby5jb20iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNDU3MTQ5MH0"
 *               message: "Authentication Success"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Invalid credentials"
 *       422:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Validation error message
 *             example:
 *               message: "Email must be a valid email address"
 */
authRouter.post('/sign-in', validateSchema(schemas.auth), signIn);

/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Create user
 *     description: Create a new user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "User created successfully"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "User already exists"
 *       422:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Validation error message
 *             example:
 *               message: "Password must contain at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
 */
authRouter.post('/sign-up', validateSchema(schemas.auth), signUp);

export { authRouter };
