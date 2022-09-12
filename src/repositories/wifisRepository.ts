import { database } from "../config/postegres";
import { WifiData } from "../types/wifiTypes";

export async function createWifi(wifi: WifiData, userId: number) {
    await database.wifi.create({
        data: { ...wifi, userId }
    });
}

export async function getUserWifis(userId: number) {
    const resultWifis = await database.wifi.findMany({
        where: { userId }
    });
    return resultWifis;
}

export async function getWifiById(userId: number, wifiId: number) {
}

export async function deleteWifi(wifiId: number) {
}