import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import sha256 from "crypto-js/sha256";
import { hash } from "argon2";

import { prisma } from "../db/client";

interface ParseForm {
  subscription_currency: string;
  subscription_price: string;
  subcsription_name: string;
  subcsription_description: string;
  subscription_type?: string;
  subcsription_paymentmethod: string;
  subcsription_member: string;
  subcsription_period?: string;
  subcsription_selectperiod?: string;
  subcsription_fpayment?: string;
  subcsription_expiredate?: string;
}

interface PriceObject {
  float: number;
  formatted: string;
  value: string;
}

export const subscriptionsRouter = createRouter()
  .mutation("create", {
    input: z.object({
      subscription_form: z.string(),
    }),
    async resolve({ input }) {
      const parseForm: ParseForm = JSON.parse(input.subscription_form);

      const priceObject: PriceObject = JSON.parse(
        parseForm.subscription_price
      ).values;

      /**Primary Subscriptions */
      let subcsription_name = parseForm.subcsription_name;
      let subcsription_description = parseForm.subcsription_description;
      let subcsription_paymentmethod = parseForm.subcsription_paymentmethod;
      let subcsription_type = JSON.parse(parseForm.subscription_type!);

      /**Subscriptions Recurring */
      let subcsription_period = parseForm.subcsription_period;
      let subcsription_selectperiod = parseForm.subcsription_selectperiod;
      let subcsription_fpayment = parseForm.subcsription_fpayment;

      /**Subscriptions One time */
      let subcsription_expiredate = parseForm.subcsription_expiredate;

      let subcsription_member = Boolean(
        JSON.parse(parseForm.subcsription_member)
      );

      /**Breakdown price object */
      let subscription_price_currency = parseForm.subscription_currency;
      let subscription_price_float = priceObject.float;
      let subscription_price_formatted = priceObject.formatted;
      let subscription_price_value = priceObject.value;

      try {
        const subscription = await prisma.subscriptions.create({
          data: {
            name: subcsription_name,
            description: subcsription_description,
            payment_method: subcsription_paymentmethod,
            type: subcsription_type,
            member_state: subcsription_member,
          },
        });

        await prisma.subscriptionPrice.create({
          data: {
            subscription_id: subscription.id,
            currency: subscription_price_currency,
            float: subscription_price_float,
            formatted: subscription_price_formatted,
            value: subscription_price_value,
          },
        });

        if (subcsription_type === "recurring") {
          await prisma.subscriptionRecurring.create({
            data: {
              subscription_id: subscription.id,
              payment_period: subcsription_period,
              payment_selectedperiod: subcsription_selectperiod,
              payment_fpayment: subcsription_fpayment,
            },
          });
        } else {
          await prisma.subscriptionOneTime.create({
            data: {
              subscription_id: subscription.id,
              payment_expiredate: subcsription_expiredate,
            },
          });
        }

        return {
          status: 200,
          message: "success",
          member_status: subcsription_member,
        };
      } catch (error) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    },
  })
  .mutation("create_member", {
    input: z.object({
      member_form: z.string(),
    }),
    async resolve({ input }) {},
  })
  .query("check", {
    input: z.object({
      subscription_id: z.string(),
    }),
    async resolve({ input }) {
      try {
        const findExist = await prisma.subscriptions.count({
          where: {
            id: input.subscription_id,
          },
        });

        if (findExist !== 0) {
          const dataPrice = await prisma.subscriptionPrice.findFirst({
            where: {
              subscription_id: input.subscription_id,
            },
          });

          return {
            status: 200,
            message: "success, find the data",
            data: dataPrice,
          };
        }

        return {
          status: 404,
          message: "cannot find the data",
          data: null,
        };
      } catch (error) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: error,
        });
      }
    },
  });
