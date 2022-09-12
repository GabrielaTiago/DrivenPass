import { Request, Response } from "express";


export async function createWifi(req: Request, res: Response) {
    const userId = Number(res.locals.userId);
    const wifi = req.body;
    
    res.status(201).send("Successfully created the wifi!");
}

export async function  getUserWifis(req: Request, res: Response) {
    const userId = Number(res.locals.userId);

    res.status(200).send();
}

export async function getWifiById(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const wifiId: number = Number(req.params.id);

    res.status(200).send();
}

export async function deleteWifi(req: Request, res: Response) {
    const userId: number = Number(res.locals.userId);
    const wifiId: number = Number(req.params.id);

    res.status(200).send("Successfully deleted the wifi!");
}