import { createPool } from "mysql2/promise";
import { env } from "$env/dynamic/private";

const pool = createPool({
    uri: env.DATABASE_URL
});

export default pool;