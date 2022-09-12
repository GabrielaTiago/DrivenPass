import { WifiData } from "../types/wifiTypes";
import { cryptographsGeneralPasswords } from "../utils/passwordEncryption";

import * as wifisRepository from "../repositories/wifisRepository"; 

export async function createWifi(wifi: WifiData, userId:number) {
    const encryptedPassword = cryptographsGeneralPasswords(wifi.password);

    await wifisRepository.createWifi({ ...wifi, password: encryptedPassword }, userId);
}

export async function getUserWifis(userId: number) {
}

export async function getWifiById(userId: number, wifiId: number) {
}

export async function deleteWifi(userId: number, wifiId: number) {
}