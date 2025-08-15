import { Router } from 'express';

import { createWifi, deleteWifi, getUserWifis, getWifiById } from '../controllers/wifiController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validateToken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const wifiRouter = Router();

wifiRouter.post('/wifis', validateSchema(schemas.wifi), validateToken, createWifi);
wifiRouter.get('/wifis/all', validateToken, getUserWifis);
wifiRouter.get('/wifis/:id', validateToken, getWifiById);
wifiRouter.delete('/wifis/:id/delete', validateToken, deleteWifi);

export { wifiRouter };
