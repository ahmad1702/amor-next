import { Post } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const examples = await prisma.post.findMany();
    res.status(200).json(examples);
  } else if (req.method === "POST") {
    if (req.body as Post) {
      const createdPost = await prisma.post.create({
        data: req.body as Post,
      });
      res.status(200).json(createdPost)
    } else {
      res.status(401).json({
        message: "Incorrectly formatted post",
        request: req.body,
      });
    }
  }
};

export default examples;
