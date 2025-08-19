import { database } from '../config/postgres';
import { WifiData } from '../types/wifiTypes';

export async function createWifi(wifi: WifiData, userId: number) {
  await database.wifi.create({
    data: { ...wifi, userId },
  });
}

export async function getUserWifi(userId: number) {
  const result = await database.wifi.findMany({
    where: { userId },
  });
  return result;
}

export async function getWifiById(id: number) {
  const specificWifi = await database.wifi.findFirst({
    where: { id },
  });
  return specificWifi;
}

export async function deleteWifi(id: number) {
  await database.wifi.delete({
    where: { id },
  });
}

export async function updateWifi(id: number, data: WifiData) {
  await database.wifi.update({
    where: { id },
    data,
  });
}
