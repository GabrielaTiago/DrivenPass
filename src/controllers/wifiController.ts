import { Request, Response } from "express";
import { WifiData } from "../types/wifiTypes";

import * as wifisServices from "../services/wifisSercices";

export async function createWifi(req: Request, res: Response) {
    const userId = Number(res.locals.userId);
    const wifi: WifiData = req.body;
    
    await wifisServices.createWifi(wifi, userId);

    res.status(201).send("Successfully created the wifi!");
}

export async function  getUserWifis(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    const allUserWifis = await wifisServices.getUserWifis(userId);

    res.status(200).send(allUserWifis);
}

export async function getWifiById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const wifiId: number = Number(req.params.id);

    const specificWifi = await wifisServices.getWifiById(userId, wifiId);

    res.status(200).send(specificWifi);
}

export async function deleteWifi(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const wifiId: number = Number(req.params.id);

    await wifisServices.deleteWifi(userId, wifiId);
    
    res.status(200).send("Successfully deleted the wifi!");
}