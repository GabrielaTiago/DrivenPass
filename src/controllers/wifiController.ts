import { Request, Response } from 'express';

import * as wifiServices from '../services/wifiService';
import { WifiData } from '../types/wifiTypes';

export async function createWifi(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const wifi: WifiData = req.body;
  await wifiServices.createWifi(wifi, userId);
  res.status(201).send({ message: 'Wifi created successfully' });
}

export async function getUserWifi(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const userWifi = await wifiServices.getUserWifi(userId);
  res.status(200).send(userWifi);
}

export async function getWifiById(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const wifiId = Number(req.params.id);
  const wifi = await wifiServices.getWifiById(userId, wifiId);
  res.status(200).send(wifi);
}

export async function deleteWifi(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const wifiId = Number(req.params.id);
  await wifiServices.deleteWifi(userId, wifiId);
  res.status(200).send({ message: 'Wifi deleted successfully' });
}

export async function updateWifi(req: Request, res: Response) {
  const userId = Number(res.locals.userId);
  const wifiId = Number(req.params.id);
  const wifiData: WifiData = req.body;
  await wifiServices.updateWifi(userId, wifiId, wifiData);
  res.status(200).send({ message: 'Wifi updated successfully' });
}
