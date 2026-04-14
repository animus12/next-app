import * as express from "express";
export const  Products = express.Router();

Products.get("/", (req, res) => {
	res.json({
		name: 'Sabon',
		quantity: 100,
		price: 50,
	})
})