import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL:"http://localhost:3000",
 secret:"tlk0x629AtKh5J7SCuSBH1o47XBUCiLL",
  emailAndPassword: {
    enabled: true,
    
  },
  
});
