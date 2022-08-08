import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import sha256 from "crypto-js/sha256";
import { hash } from "argon2";

import { prisma } from "../db/client";

export const userRouter = createRouter().mutation("create", {
  input: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(4),
  }),
  async resolve({ input }) {
    const { name, email, password } = input;

    const exists = await prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "User Already Exists.",
      });
    }

    const hashPassword = await hash(password);

    const result = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };
  },
});
