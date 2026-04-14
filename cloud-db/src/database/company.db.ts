import { DataSource } from "typeorm";
import { 
	Photo,
	AdminUser,
	Customers,
	BandwidthProfile,
	ActiveRouter,
	ServiceAccounts,
	AutoNumbers
 } from "../entity";
import { Mikrotik } from "../entity/mikrotik";
import { Plan } from "../entity/plan.entity";

 export const dbEntities = [
	Photo,
	AdminUser,
	Customers,
	Mikrotik,
	BandwidthProfile,
	Plan,
	ActiveRouter,
	ServiceAccounts,
	AutoNumbers
 ]

let dataSource: DataSource;

export async function dbConnection(): Promise<DataSource> {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "mark",
    password: "animus",
    database: "clouddb",
    synchronize: false,
    logging: false,
    entities: dbEntities,
  });

  try {
    await dataSource.initialize();
    console.log("DB Connected ✅");
    return dataSource;
  } catch (error) {
    console.error("DB Connection Failed ❌", error);
    throw error;
  }
}
