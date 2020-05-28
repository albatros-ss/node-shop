import { Request, Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const { validationResult } = require("express-validator");
const { courseValidators } = require("../utils/validators");
const Course = require("../models/course");
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ add: true });
});

router.post("/", courseValidators, async (req: Req, res: Response) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array()[0].msg);
    }

    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      userId: req.user,
    });
    await course.save();
    res.json();
  } catch (e) {
    const errors: Array<string> = [];
    for (const key in e.errors) {
      if (e.errors[key].properties) {
        errors.push(e.errors[key].properties.message);
      }
    }
    res.status(500).json(errors);
  }
});

module.exports = router;
