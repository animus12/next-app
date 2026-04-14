import * as express from "express";
import axios from "axios";
import * as https from "https";
import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { BandwidthProfile } from "@ace/cloud-db/lib/entity";

export const Profile = express.Router();

Profile.post("/save-profile", async (req, res) => {
	try {
		const conn = await dbConnection()
		const data = req.body as BandwidthProfile;
		const repo = conn.manager.getRepository(BandwidthProfile);

		const pf = new BandwidthProfile();
		if (data.id) {
			pf.id = data.id;
		}

		pf.name = data.name
		pf.downloadRate = data.downloadRate
		pf.uploadRate = data.uploadRate
		pf.dlBurstRate = data.dlBurstRate
		pf.ulBurstRate = data.ulBurstRate
		pf.dlThresholdRate = data.dlThresholdRate
		pf.ulThresholdRate = data.ulThresholdRate
		pf.dlBurstTime = 	data.dlBurstTime
		pf.ulBurstTime = data.ulBurstTime 

		// 4. Save to Database
		await repo.save(pf); 
		return res.json({ success: true, message: data.id ? "Updated!" : "Saved!" });
		
	} catch (error) {
		console.log(error)
	}	
});

Profile.get("/get-profile", async (req, res) => {
  try {
    const conn = await dbConnection();
    const query = await conn.getRepository(BandwidthProfile).find({
      select: [
        "id",
				"name",
        "downloadRate",
        "uploadRate",
        "dlBurstRate",
        "ulBurstRate",
        "dlThresholdRate",
        "ulThresholdRate",
        "dlBurstTime",
        "ulBurstTime",
      ]
    });

    res.json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
});

Profile.post("/delete-profile", async (req, res) => {
  try {
		const conn = await dbConnection();
		const repo = conn.getRepository(BandwidthProfile);
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