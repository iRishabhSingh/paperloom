import { z } from "zod";

// Base schemas
export const PersonalDetailsSchema = z.object({
  profileImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

export const AccountDetailsSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AdditionalDetailsSchema = z.object({
  region: z.string().min(1, "Region is required"),
  country: z.string().optional(),
  isoCode: z.string().optional(),
  phone: z.string().optional(),
  terms: z
    .boolean()
    .refine((val) => val, "You must accept the terms and conditions"),
});

// Combined schema
export const RegisterSchema = PersonalDetailsSchema.and(
  AccountDetailsSchema
).and(AdditionalDetailsSchema);

// Other schemas
export const VerifySchema = z.object({
  userId: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  type: z.enum(["email-verify", "2fa"]),
});

export const ResendOTPSchema = z.object({
  type: z.enum(["email-verify", "2fa"]),
  identifier: z.string(),
});

// Type definitions
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type PersonalDetailsType = z.infer<typeof PersonalDetailsSchema>;
export type AccountDetailsType = z.infer<typeof AccountDetailsSchema>;
export type AdditionalDetailsType = z.infer<typeof AdditionalDetailsSchema>;
export type VerifySchemaType = z.infer<typeof VerifySchema>;
export type ResendOTPSchemaType = z.infer<typeof ResendOTPSchema>;
