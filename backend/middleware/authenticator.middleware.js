import jwt from "jsonwebtoken";

export const verifySupabaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];

  const key = process.env.SUPABASE_JWT_KEY;

  jwt.verify(
    token,
    key,
    {
      algorithms: ["HS256"],
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.user = decoded;
      next();
    }
  );
};
