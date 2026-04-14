import * as express from "express";
import { createAccessCookie, createAccessToken } from "../../resolvers/auth/auth";
import { dbConnection } from "@ace/cloud-db/lib/database/company.db";
import { AdminUser, Customers } from "@ace/cloud-db/lib/entity";
import bcrypt from "bcrypt";

export const Auth = express.Router();

Auth.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		console.log(req.body)

		if (!username || !password) {
			return res.status(400).json({ message: "Username and password required" });
		}

		const adminUser = await dbConnection();
		const foundAdmin: AdminUser | null = await adminUser.getRepository(AdminUser).findOneBy({ username });

		if (!foundAdmin) {
			return res.status(401).json({ message: "Invalid username or password" });
		}

		if (!foundAdmin.password) {
			return res.status(500).json({ message: "No password stored for user" });
		}

		// ✅ this will no longer throw because both args are defined
		const isMatch = await bcrypt.compare(password, foundAdmin.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid password" });
		}

		const accessToken = createAccessToken(foundAdmin.username, foundAdmin.id);
		createAccessCookie(res, accessToken);

		return res.json({ 
      message: "success",
      status: 200,
      user: {
        firstName: foundAdmin.firstName,
        lastName: foundAdmin.lastName,
        middleName: foundAdmin.middleName,
        username: foundAdmin.username,
        role: foundAdmin.role, // kung meron man
        // isama rito ang iba pang fields na gusto mong ipakita sa profile
      }
    });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

Auth.post("/logout", (req, res) => {
  res.clearCookie(process.env.ACCESS_COOKIE_NAME!, { path: '/' });
  return res.json({ message: "Logged out" });
});

Auth.post("/register", async (req, res) => {
  const conn = await dbConnection();
  const queryRunner = conn.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const { username, password, firstName, lastName, middleName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const foundUser = await queryRunner.manager.getRepository(AdminUser)
      .findOne({ where: { username } });

    const ua = new AdminUser();
    if (foundUser) {
      ua.id = foundUser.id;
      ua.username = foundUser.username;
    } else {
      ua.username = username;
    }

    ua.password = await bcrypt.hash(password, 10);
    ua.firstName = firstName;
    ua.lastName = lastName;
    ua.middleName = middleName;

    await queryRunner.manager.getRepository(AdminUser).save(ua);
    await queryRunner.commitTransaction();

    return res.json({ success: true, username: ua.username });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await queryRunner.release();
  }
});