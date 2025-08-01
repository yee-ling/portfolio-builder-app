module.exports = (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(401).json({ msg: "Admin access required" });
    }
  } catch (e) {
    return res
      .status(401)
      .json({ error: e.message, msg: "You are not an admin" });
  }
};
