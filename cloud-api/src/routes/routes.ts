import * as express from "express";
import { CustomerRoutes } from "./customers";
import { Products } from "./products";
import { Auth } from "./auth/login";
import { IsAuth } from "../resolvers/auth/is-auth-middlware";
import { MikroTikRoutes } from "./mikrotik";
import { Profile } from "./profile";
import { PlanRoute } from "./plan";
export const Routes = express.Router();
export const Login = express.Router();

// Protected routes
Routes.use("/customer", IsAuth, CustomerRoutes)
Routes.use("/product", IsAuth, Products)
Routes.use("/menu", IsAuth, Profile)
Routes.use("/menu", IsAuth, PlanRoute)
Routes.use("/management", IsAuth, CustomerRoutes)

// Public routes
Login.use("/auth", Auth)
Login.use("/mikrotik", MikroTikRoutes)