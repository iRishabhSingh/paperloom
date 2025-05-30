import redis from "@/lib/redis";
import { randomInt } from "crypto";

export const generateOtp = () => {
  return randomInt(100000, 1000000).toString(); // returns a 6-digit numeric OTP
};

export const saveOtp = async (key: string, otp: string, otpExpiry: number) => {
  await redis.set(key, otp, "EX", otpExpiry); // Store OTP in Redis with a 5-minute expiration
};

export const verifyOtp = async (key: string, otp: string) => {
  const savedOtp = await redis.get(key);
  if (savedOtp && savedOtp === otp) {
    await redis.del(key); // OTP used, delete it
    return true;
  }
  return false;
};
