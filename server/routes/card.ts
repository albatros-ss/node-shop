import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const router = Router();
const Course = require("../models/course");

function mapCartItems(cart: Record<string, any>): object {
  return cart.items.map((c: Record<string, any>) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}

router.post("/add", async (req: Req, res: Response) => {
  try {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.json();
  } catch (e) {
    res.status(500).json();
  }
});

router.delete("/remove/:id", async (req: Req, res: Response) => {
  try {
    await req.user.removeFromCart(req.params.id);
    await req.user.populate("cart.items.courseId").execPopulate();
    res.json();
  } catch (e) {
    res.status(500);
  }
});

router.get("/", async (req: Req, res: Response) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = mapCartItems(user.cart);

    const resObj: object = {
      isCard: true,
      courses,
    };
    return res.json(resObj);
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
