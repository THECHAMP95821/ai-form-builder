import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

const sql = neon('postgresql://AI%20Form%20Builder_owner:b7IQRNJ3kUZt@ep-cold-sky-a52i4f58.us-east-2.aws.neon.tech/AI-Form-Builder?sslmode=require');
export const db = drizzle(sql,{schema});