import { Wifi } from '@prisma/client';

import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as wifiRepository from '../repositories/wifiRepository';
import { WifiData } from '../types/wifiTypes';
import { encryptPassword, decryptPassword } from '../utils/passwordEncryption';

export async function createWifi(wifi: WifiData, userId: number) {
  const encryptedPassword = encryptPassword(wifi.password);
  await wifiRepository.createWifi({ ...wifi, password: encryptedPassword }, userId);
}

export async function getUserWifi(userId: number) {
  const wifi = await wifiRepository.getUserWifi(userId);
  return wifi.map(decryptWifi);
}

export async function getWifiById(userId: number, wifiId: number) {
  const wifi = await validateWifiAccess(userId, wifiId);
  return decryptWifi(wifi);
}

export async function updateWifi(userId: number, wifiId: number, data: WifiData) {
  await validateWifiAccess(userId, wifiId);
  const encryptedPassword = encryptPassword(data.password);
  await wifiRepository.updateWifi(wifiId, { ...data, password: encryptedPassword });
}

export async function deleteWifi(userId: number, wifiId: number) {
  await validateWifiAccess(userId, wifiId);
  await wifiRepository.deleteWifi(wifiId);
}

async function validateWifiAccess(userId: number, wifiId: number) {
  const wifi = await wifiRepository.getWifiById(wifiId);
  if (!wifi) throw throwErrorMessage('not_found', "Wifi doesn't exist");
  if (wifi.userId !== userId) throw throwErrorMessage('forbidden', "You don't have permission to perform this action");
  return wifi;
}

function decryptWifi(wifi: Wifi) {
  return { ...wifi, password: decryptPassword(wifi.password) };
}
