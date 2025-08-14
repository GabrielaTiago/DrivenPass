import { Router } from 'express';

import { createWifi, deleteWifi, getUserWifis, getWifiById } from '../controllers/wifiController';
import { validateSchemas } from '../middlewares/validateSchemasMiddleware';
import { validatetoken } from '../middlewares/validateTokenMiddleware';

const wifiRouter = Router();

wifiRouter.post('/wifis', validateSchemas('wifi'), validatetoken, createWifi);
wifiRouter.get('/wifis/all', validatetoken, getUserWifis);
wifiRouter.get('/wifis/:id', validatetoken, getWifiById);
wifiRouter.delete('/wifis/:id/delete', validatetoken, deleteWifi);

export { wifiRouter };
