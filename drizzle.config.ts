import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://AI%20Form%20Builder_owner:b7IQRNJ3kUZt@ep-cold-sky-a52i4f58.us-east-2.aws.neon.tech/AI-Form-Builder?sslmode=require',
  }
});