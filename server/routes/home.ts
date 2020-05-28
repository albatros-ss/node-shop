import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const path = require("path");
const router = Router();

router.get("*", (req: Req, res: Response) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

module.exports = router;
