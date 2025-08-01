module.exports = (req, res, next) => {
  try {
    if (req.user?.isPremium) {
      next();
    } else {
      return res
        .status(401)
        .json({ msg: "You need to be a premium user to continue" });
    }
  } catch (e) {
    return res
      .status(401)
      .json({ error: e.message, msg: "You are not a premium user" });
  }
};
