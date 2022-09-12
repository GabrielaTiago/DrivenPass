import { WifiData } from "../types/wifiTypes";
import { cryptographsGeneralPasswords, decryptsPassword } from "../utils/passwordEncryption";

import * as wifisRepository from "../repositories/wifisRepository"; 
import { throwErrorMessage } from "../middlewares/errorHandlerMiddleware";

export async function createWifi(wifi: WifiData, userId:number) {
    const encryptedPassword = cryptographsGeneralPasswords(wifi.password);

    await wifisRepository.createWifi({ ...wifi, password: encryptedPassword }, userId);
}

export async function getUserWifis(userId: number) {
    const allUserWifis = await wifisRepository.getUserWifis(userId);

    if (!allUserWifis) {
        throw throwErrorMessage("not_found", "No wifis were found");
    }

    const decryptedWifis =  allUserWifis.map((wifi) => {
        return {
            ...wifi,
            password: decryptsPassword(wifi.password)
        }
    });

    return decryptedWifis;
}

export async function getWifiById(userId: number, wifiId: number) {
}

export async function deleteWifi(userId: number, wifiId: number) {
}