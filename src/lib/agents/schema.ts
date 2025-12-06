import { z } from "zod";

const basicSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(80, "Name must be 80 characters or fewer"),
  oneLiner: z
    .string()
    .trim()
    .min(10, "One-liner must be at least 10 characters")
    .max(80, "One-liner must be 80 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(40, "Description must be at least 40 characters")
    .max(5000, "Description must be 5000 characters or fewer"),
  category: z.enum(["marketing", "support", "finance", "ops", "hr", "content", "other"]),
  logoUrl: z
    .string()
    .trim()
    .url("logoUrl must be a valid URL")
    .optional(),
});

const pricingSchema = z
  .object({
    model: z.enum(["FREE", "ONE_TIME", "SUBSCRIPTION"]),
    currency: z.enum(["USD", "CAD"]),
    amount: z.number().positive("Amount must be greater than 0").max(100000, "Amount exceeds limit").optional(),
    trialDays: z.number().int().min(0, "Trial days cannot be negative").max(30, "Trial days cannot exceed 30").optional(),
    offersSevenDayRefund: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if ((data.model === "ONE_TIME" || data.model === "SUBSCRIPTION") && data.amount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Amount is required for paid models",
      });
    }

    if (data.model !== "SUBSCRIPTION" && data.trialDays != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["trialDays"],
        message: "Trial days are only available for subscription pricing",
      });
    }
  });

const techSchema = z.object({
  configJson: z.string().trim().min(1, "configJson cannot be empty"),
  endpointUrl: z.string().trim().url("endpointUrl must be a valid URL"),
  requiredScopes: z
    .array(z.string().trim().min(1, "Scope cannot be empty").max(64, "Scope is too long"))
    .max(20, "Too many scopes")
    .optional()
    .default([]),
});

const metaSchema = z.object({
  acceptedCreatorAgreement: z
    .boolean()
    .refine((value) => value === true, { message: "Creator agreement must be accepted" }),
});

export const agentSubmissionSchema = z.object({
  basic: basicSchema,
  pricing: pricingSchema,
  tech: techSchema,
  meta: metaSchema,
});

export type AgentSubmissionInput = z.infer<typeof agentSubmissionSchema>;
