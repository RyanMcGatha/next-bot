import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/discord-bots",
});

export default pool;
