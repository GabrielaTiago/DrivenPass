import { Router } from 'express';

import { createWifi, deleteWifi, getUserWifi, getWifiById, updateWifi } from '../controllers/wifiController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const wifiRouter = Router();

wifiRouter.post('/wifi', validateSchema(schemas.wifi), validateToken, createWifi);
wifiRouter.get('/wifi/all', validateToken, getUserWifi);
wifiRouter.get('/wifi/:id', validateToken, getWifiById);
wifiRouter.put('/wifi/:id', validateSchema(schemas.wifi), validateToken, updateWifi);
wifiRouter.delete('/wifi/:id', validateToken, deleteWifi);

export { wifiRouter };
