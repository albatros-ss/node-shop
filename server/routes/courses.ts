import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (req: Req, res: Response) => {
  try {
    let courses = await Course.find()
      .populate("userId", "email")
      .select("price title img");
    const user = req.user ? req.user._id.toString() : null;
    courses = JSON.parse(JSON.stringify(courses)).map(
      (course: Record<string, any>) => {
        const newCourse = course;
        if (!user) {
          newCourse.owner = false;
        } else {
          newCourse.owner = newCourse.userId._id === req.user._id.toString();
        }
        delete newCourse.userId;
        return newCourse;
      }
    );
    res.json({
      courses,
      isCourses: true,
      userId: user,
    });
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
