import { Router } from 'express';

import { createCard, deleteCard, getCardById, getUserCards, updateCard } from '../controllers/cardsController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const cardsRouter = Router();

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Create a new card
 *     description: Create a new card with the provided information
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Card created successfully"
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
 *               message: "Nickname must be less than 20 characters"
 */
cardsRouter.post('/cards', validateSchema(schemas.card), validateToken, createCard);

/**
 * @swagger
 * /cards/all:
 *   get:
 *     summary: Get all cards
 *     description: Get all cards for the authenticated user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *             example:
 *               - id: 1
 *                 userId: 1
 *                 nickname: "My Card"
 *                 printedName: "JOHN DOE"
 *                 number: "1234567890123456"
 *                 cvv: "123"
 *                 expirationDate: "12/25"
 *                 password: "1234"
 *                 virtual: false
 *                 type: "both"
 *               - id: 2
 *                 userId: 1
 *                 nickname: "My Card 2"
 *                 printedName: "JOHN DOE"
 *                 number: "1234567890123456"
 *                 cvv: "123"
 *                 expirationDate: "12/30"
 *                 password: "1234"
 *                 virtual: false
 *                 type: "credit"
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
cardsRouter.get('/cards/all', validateToken, getUserCards);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Get a card by id
 *     description: Get a card by id for the authenticated user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Card ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *             example:
 *               id: 1
 *               userId: 1
 *               nickname: "My Card"
 *               printedName: "JOHN DOE"
 *               number: "1234567890123456"
 *               cvv: "123"
 *               expirationDate: "12/25"
 *               password: "1234"
 *               virtual: false
 *               type: "both"
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
 *         description: Card doesn't belong to the user
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
 *         description: Card doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Card doesn't exist"
 */
cardsRouter.get('/cards/:id', validateToken, getCardById);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Update card
 *     description: Update an existing card of the authenticated user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Card updated successfully"
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
 *         description: Card doesn't belong to the user
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
 *         description: Card doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Card doesn't exist"
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
 *               message: "Nickname can not be empty"
 */

cardsRouter.put('/cards/:id', validateSchema(schemas.card), validateToken, updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Delete a card
 *     description: Delete a card of the authenticated user
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Card deleted successfully"
 *       401:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Token JWT not sent"
 *       403:
 *         description: Card doesn't belong to the user
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
 *         description: Card doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Card doesn't exist"
 */
cardsRouter.delete('/cards/:id', validateToken, deleteCard);

export { cardsRouter };
