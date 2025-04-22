import express from "express";
import prisma from "./../db/index.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const val = await prisma.user.findUnique({
    where: {
      id: req.user.sub,
    },
  });
  console.log(val);
  if (!val) {
    if (req.user.user_metadata.email && req.user.user_metadata.email_verified) {
      const user = await prisma.user.create({
        data: {
          id: req.user.sub,
          email: req.user.email,
        },
      });
      return res.status(200).send(user);
    } else {
      return res.status(401).send("Unauthorized");
    }
  } else {
    const user = {
      id: val.id,
      email: val.email,
    };
    return res.status(200).send(user);
  }
});

router.get("/get-user", (req, res) => {
  const { id } = req.params;
  res.send(`respond with a resource ${id}`);
});

export default router;
