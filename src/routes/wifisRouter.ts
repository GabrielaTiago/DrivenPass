import { Router } from 'express';

import { createWifi, deleteWifi, getUserWifi, getWifiById, updateWifi } from '../controllers/wifiController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const wifiRouter = Router();

/**
 * @swagger
 * /wifi:
 *   post:
 *     summary: Create a new wifi
 *     description: Create a new wifi for the authenticated user
 *     tags: [Wifi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wifi'
 *     responses:
 *       201:
 *         description: Wifi created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Wifi created successfully"
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
 *               message: "Password must be at least 8 characters"
 */
wifiRouter.post('/wifi', validateSchema(schemas.wifi), validateToken, createWifi);

/**
 * @swagger
 * /wifi/all:
 *   get:
 *     summary: Get all wifi
 *     description: Get all wifi for the authenticated user
 *     tags: [Wifi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wifi retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wifi'
 *             example:
 *               - id: 1
 *                 userId: 1
 *                 title: "My Wifi"
 *                 wifiName: "My Wifi"
 *                 password: "12345678"
 *               - id: 2
 *                 userId: 1
 *                 title: "My Wifi 2"
 *                 wifiName: "My Wifi 2"
 *                 password: "12345678"
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
wifiRouter.get('/wifi/all', validateToken, getUserWifi);

/**
 * @swagger
 * /wifi/{id}:
 *   get:
 *     summary: Get a wifi by id
 *     description: Get a wifi by id for the authenticated user
 *     tags: [Wifi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Wifi ID
 *     responses:
 *       200:
 *         description: Wifi retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wifi'
 *             example:
 *               id: 1
 *               userId: 1
 *               title: "My Wifi"
 *               wifiName: "My Wifi"
 *               password: "12345678"
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
 *         description: Wifi doesn't belong to the user
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
 *         description: Wifi doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Wifi doesn't exist"
 */
wifiRouter.get('/wifi/:id', validateToken, getWifiById);

/**
 * @swagger
 * /wifi/{id}:
 *   put:
 *     summary: Update a wifi
 *     description: Update an existing wifi of the authenticated user
 *     tags: [Wifi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Wifi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wifi'
 *     responses:
 *       200:
 *         description: Wifi updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Wifi updated successfully"
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
 *               message: "You don't have permission to perform this action"
 *       403:
 *         description: Wifi doesn't belong to the user
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
 *         description: Wifi doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Wifi doesn't exist"
 */
wifiRouter.put('/wifi/:id', validateSchema(schemas.wifi), validateToken, updateWifi);

/**
 * @swagger
 * /wifi/{id}:
 *   delete:
 *     summary: Delete a wifi
 *     description: Delete a wifi of the authenticated user
 *     tags: [Wifi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Wifi ID
 *     responses:
 *       200:
 *         description: Wifi deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *             example:
 *               message: "Wifi deleted successfully"
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
 *         description: Wifi doesn't belong to the user
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
 *         description: Wifi doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *             example:
 *               message: "Wifi doesn't exist"
 */
wifiRouter.delete('/wifi/:id', validateToken, deleteWifi);

export { wifiRouter };
