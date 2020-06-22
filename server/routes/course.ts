import { Request, Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const Course = require("../models/course");
const { validationResult } = require("express-validator");
const { courseValidators } = require("../utils/validators");
const router = Router();

router.get("/:id/edit", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json({ course });
  } catch (e) {
    res.status(500).send();
  }
});

router.put("/edit", courseValidators, async (req: Req, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send(errors.array()[0].msg);
    }

    const { id } = req.body;
    delete req.body._id;
    const course = await Course.findById(id);
    if (course.userId.toString() === req.user._id.toString()) {
      Object.assign(course, req.body);
      await course.save();
    }
    res.json();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json({ course });
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/remove/:id", async (req: Req, res: Response) => {
  try {
    await Course.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json();
  } catch (e) {
    res.status(500).json();
  }
});

module.exports = router;
