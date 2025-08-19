import { Router } from 'express';

import { createCredential, deleteCredentials, getUserCredentials, getCredentialById, updateCredential } from '../controllers/credentialsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const credentialRouter = Router();

/**
 * @swagger
 * /credentials:
 *   post:
 *     summary: Create a new credential
 *     description: Create a new credential for the authenticated user
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credential'
 *     responses:
 *       201:
 *         description: Credential created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Credential created successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "JWT token is required or invalid"
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
 *               message: "Title can not be empty"
 */
credentialRouter.post('/credentials', validateSchema(schemas.credential), validateToken, createCredential);

/**
 * @swagger
 * /credentials/all:
 *   get:
 *     summary: Get all credentials
 *     description: Get all credentials of the authenticated user
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credentials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Credential'
 *             example:
 *               - id: 1
 *                 userId: 1
 *                 title: "My Credential"
 *                 url: "https://www.youtube.com"
 *                 username: "john.doe"
 *                 password: "1234"
 *               - id: 2
 *                 userId: 1
 *                 title: "My Credential 2"
 *                 url: "https://www.twitter.com"
 *                 username: "john.doe"
 *                 password: "56678"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "JWT token is required or invalid"
 */
credentialRouter.get('/credentials/all', validateToken, getUserCredentials);

/**
 * @swagger
 * /credentials/{id}:
 *   get:
 *     summary: Get a credential by id
 *     description: Get a credential by id of the authenticated user
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Credential ID
 *     responses:
 *       200:
 *         description: Credential retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Credential'
 *             example:
 *               id: 1
 *               userId: 1
 *               title: "My Credential"
 *               url: "https://www.youtube.com"
 *               username: "john.doe"
 *               password: "1234"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "JWT token is required or invalid"
 *       403:
 *         description: Credential doesn't belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "You don't have permission to perform this action"
 *       404:
 *         description: Credential doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Credential doesn't exist"
 */
credentialRouter.get('/credentials/:id', validateToken, getCredentialById);

/**
 * @swagger
 * /credentials/{id}:
 *   put:
 *     summary: Update a credential
 *     description: Update an existing credential of the authenticated user
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Credential ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credential'
 *     responses:
 *       200:
 *         description: Credential updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Credential updated successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "JWT token is required or invalid"
 *       403:
 *         description: Credential doesn't belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "You don't have permission to perform this action"
 *       404:
 *         description: Credential doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Credential doesn't exist"
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
 *               message: "Title can not be empty"
 */
credentialRouter.put('/credentials/:id', validateToken, updateCredential);

/**
 * @swagger
 * /credentials/{id}:
 *   delete:
 *     summary: Delete a credential
 *     description: Delete a credential of the authenticated user
 *     tags: [Credentials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Credential ID
 *     responses:
 *       200:
 *         description: Credential deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Credential deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "JWT token is required or invalid"
 *       403:
 *         description: Credential doesn't belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "You don't have permission to perform this action"
 *       404:
 *         description: Credential doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Credential deleted successfully"
 */
credentialRouter.delete('/credentials/:id', validateToken, deleteCredentials);

export { credentialRouter };
