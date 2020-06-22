import { Response } from "express-serve-static-core";
import { Req } from "../interfaces/interfaces";
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const keys = require("../keys");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const router = Router();

const transporter = nodemailer.createTransport(
  sendgrid({
    // eslint-disable-next-line @typescript-eslint/camelcase
    auth: { api_key: keys.SENDGRID_API_KEY },
  })
);

router.get("/info", async (req: Req, res: Response) => {
  res.json({
    token: req.csrfToken ? req.csrfToken() : "",
    isAuth: Boolean(req.session.user),
    userId: req.user ? req.user._id.toString() : "",
    confirm: req.user ? req.user.confirm : false,
    confirmTokenExp: req.user ? req.user.confirmTokenExp : null,
  });
});

router.get("/logout", async (req: Req, res: Response) => {
  req.session.destroy(() => {
    res.send();
  });
});

router.post("/login", async (req: Req, res: Response) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.save((err: any) => {
          if (err) {
            throw err;
          }
          res.send();
        });
      } else {
        res.send("Неверный пароль");
      }
    } else {
      res.send("Такого пользователя не существует");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", async (req: Req, res: Response) => {
  try {
    crypto.randomBytes(
      32,
      async (err: any, buffer: { toString: (arg0: string) => any }) => {
        const { email, password, name } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
          res.send("Пользователь с таким email уже существует");
        } else {
          const hashPassword = await bcrypt.hash(password, 10);
          const token = buffer.toString("hex");
          const user = new User({
            email,
            name,
            password: hashPassword,
            cart: { items: [] },
            confirmToken: token,
            confirmTokenExp: Date.now() + 60 * 60 * 1000,
            confirm: false,
          });
          req.session.user = await user.save();
          req.session.save((err: any) => {
            if (err) {
              throw err;
            }
            res.send();
          });
          await transporter.sendMail(regEmail(email, token));
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

router.put("/reset", (req: Req, res: Response) => {
  try {
    crypto.randomBytes(
      32,
      async (err: any, buffer: { toString: (arg0: string) => any }) => {
        if (err) {
          return res.send("Что-то пошло не так, повторите попытку позже");
        }

        const token = buffer.toString("hex");
        const candidate = await User.findOne({ email: req.body.email });

        if (candidate) {
          candidate.resetToken = token;
          candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
          await candidate.save();
          await transporter.sendMail(resetEmail(candidate.email, token));
          res.send();
        } else {
          res.send("Такого емейла нет");
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

router.get("/password/:token", async (req: Req, res: Response) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      res.send();
    } else {
      res.send(user._id.toString());
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/confirm/:token", async (req: Req, res: Response) => {
  try {
    const user = await User.findOne({
      confirmToken: req.params.token,
      confirmTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      crypto.randomBytes(
        32,
        async (err: any, buffer: { toString: (arg0: string) => any }) => {
          const user = await User.findOne({
            confirmToken: req.params.token,
          });

          if (!user) {
            res.json({
              status: false,
              text: "Пользователь не найден или пользователь подтвержден",
            });
          } else {
            const token = buffer.toString("hex");

            user.confirmToken = token;
            user.resetTokenExp = Date.now() + 60 * 60 * 1000;
            await user.save();
            await transporter.sendMail(regEmail(user.email, token));
            res.json({
              status: true,
              text:
                "На вашу почту было повторно отправлено письмо для подтвержения",
            });
          }
        }
      );
    } else {
      user.confirm = true;
      user.confirmToken = undefined;
      user.confirmTokenExp = undefined;
      await user.save();
      res.json({ status: false, text: "Почта подтверждена" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/password", async (req: Req, res: Response) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.send();
    } else {
      res.send("Время жизни токена истекло");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
