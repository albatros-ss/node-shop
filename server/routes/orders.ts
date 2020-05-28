import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const Order = require("../models/order");
const confirmUser = require("../middleware/confirmUser");
const router = Router();

router.get("/", confirmUser, async (req: Req, res: Response) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );

    const obj = {
      isOrder: true,
      orders: orders.map((o: Record<string, any>) => {
        return {
          ...o._doc,
          price: o.courses.reduce((total: number, c: Record<string, any>) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    };
    res.json(obj);
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req: Req, res: Response) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = user.cart.items.map((i: Record<string, any>) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });

    await order.save();
    await req.user.clearCart();

    res.json();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
