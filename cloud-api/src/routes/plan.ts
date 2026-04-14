import * as express from "express";
import axios from "axios";
import * as https from "https";
import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { BandwidthProfile, Plan } from "@ace/cloud-db/lib/entity";

export const PlanRoute = express.Router();

PlanRoute.post("/save-plan", async (req, res) => {
	try {
		const conn = await dbConnection()
		const data = req.body as Plan;
		const repo = conn.manager.getRepository(Plan);

		const pl = new Plan();
		
		if (data.id) {
			pl.id = data.id;
		}
		pl.name = data.name
		pl.description = data.description
		pl.profileId = data.profileId
		pl.price = data.price

		await repo.save(pl); 
		return res.json({ success: true, message: data.id ? "Updated!" : "Saved!" });
		
	} catch (error) {
		console.log(error)
	}	
});

PlanRoute.get("/get-plan", async (req, res) => {
	try {
		const conn = await dbConnection();
		const data = await conn.manager.createQueryBuilder()
		.select([
			"pl.id as id",
			"pl.name as name",
			"pl.description as description",
			"pl.price as price",
			"bp.name as profileName",
			"bp.id as profileId"
		])
		.from(Plan, "pl")
		.leftJoin(BandwidthProfile, "bp", "pl.profileId = bp.id")
		.getRawMany()

		res.json(data);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error fetching data" });
	}
});

PlanRoute.post("/delete-plan", async (req, res) => {
	try {
		const conn = await dbConnection();
		const repo = conn.getRepository(Plan);
		const { id } = req.body;
		if (!id) {
			return res.status(400).json({ message: 'Missing Profile ID' });
		}

		const router = await repo.findOne({ where: { id } });
		if (!router) {
			return res.status(404).json({deleted: false, message: 'Profile not found' });
		}

		await repo.remove(router);
		res.json({deleted: true, message: 'Profile deleted successfully', id });
	 
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});