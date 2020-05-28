export {};
const User = require("../models/user");

module.exports = async function (req, res, next): Promise<any> {
  req.user = await User.findById(req.session.user._id);
  if (req.user) {
    if (req.user.confirm || req.user.confirmTokenExp > Date.now()) {
      return next();
    } else {
      return res.status(406).send("Вы не подтвердили свою почту");
    }
  }
  res.status(401).send();
};
