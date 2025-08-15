import { Router } from 'express';

import { createWifi, deleteWifi, getUserWifis, getWifiById } from '../controllers/wifiController';
import { validateSchema } from '../middlewares/validateSchemaMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';
import { schemas } from '../schemas/schemas';

const wifiRouter = Router();

wifiRouter.post('/wifis', validateSchema(schemas.wifi), validatetoken, createWifi);
wifiRouter.get('/wifis/all', validatetoken, getUserWifis);
wifiRouter.get('/wifis/:id', validatetoken, getWifiById);
wifiRouter.delete('/wifis/:id/delete', validatetoken, deleteWifi);

export { wifiRouter };
