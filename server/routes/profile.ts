import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/", async (req: Req, res: Response) => {
  const user = req.user.toObject();
  let avatarUrl = user.avatarUrl;
  if (avatarUrl) {
    avatarUrl = avatarUrl.replace("public", "");
  }
  res.json({ name: user.name, email: user.email, avatarUrl });
});

router.put("/", async (req: Req, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
    };

    if (req.file) {
      toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange);
    await user.save();
    if (req.file) {
      return res.send(req.file.path.replace("public", ""));
    }
    res.send();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
