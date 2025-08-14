import { throwErrorMessage } from '../middlewares/errorHandlerMiddleware';
import * as wifisRepository from '../repositories/wifisRepository';
import { WifiData } from '../types/wifiTypes';
import { cryptographsGeneralPasswords, decryptsPassword } from '../utils/passwordEncryption';


export async function createWifi(wifi: WifiData, userId: number) {
  const encryptedPassword = cryptographsGeneralPasswords(wifi.password);

  await wifisRepository.createWifi({ ...wifi, password: encryptedPassword }, userId);
}

export async function getUserWifis(userId: number) {
  const allUserWifis = await wifisRepository.getUserWifis(userId);

  if (!allUserWifis) {
    throw throwErrorMessage('not_found', 'No wifis were found');
  }

  const decryptedWifis = allUserWifis.map((wifi) => {
    return {
      ...wifi,
      password: decryptsPassword(wifi.password),
    };
  });

  return decryptedWifis;
}

export async function getWifiById(userId: number, wifiId: number) {
  const specificWifi = await wifisRepository.getWifiById(wifiId);

  if (!specificWifi) {
    throw throwErrorMessage('not_found', "It seems that this wifi doesn't exist yet");
  }

  if (specificWifi.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to see this wifi");
  }

  const decryptedPassword = decryptsPassword(specificWifi.password);

  const decryptedWifi = { ...specificWifi, password: decryptedPassword };

  return decryptedWifi;
}

export async function deleteWifi(userId: number, wifiId: number) {
  const wifiForDelection = await wifisRepository.getWifiById(wifiId);

  if (!wifiForDelection) {
    throw throwErrorMessage('not_found', "This wifi doesn't exist");
  }

  if (wifiForDelection.userId !== userId) {
    throw throwErrorMessage('forbidden', "You don't have the permition to delete this wifi");
  }

  await wifisRepository.deleteWifi(wifiForDelection.id);
}
