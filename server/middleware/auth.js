import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Access denied");
  if (!token) return res.status(401).json({ err: "Access denied" });
  if (!token) return res.status(400).json({ err: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    // req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
    res.status(400).send({ message: "Invalid token", err: err });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
