import { type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export const getStatus = (_req: Request, res: Response) => {
	fs.readFile(path.join(__dirname, "status.html"), "utf8", (err, html) => {
		if (err) {
			return res.status(500).send("Error reading HTML file");
		}

		// Send the rendered HTML response
		res.status(200).send(html);
	});
};
