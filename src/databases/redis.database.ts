import { createClient } from "redis";
import { ENVIRONMENT, RD_PASSWORD, RD_HOST, RD_PORT } from "~/configs/config";

let client = createClient({
  socket: {
    host: RD_HOST,
    port: RD_PORT,
  },
});

if (ENVIRONMENT === "production") {
  client = createClient({
    password: RD_PASSWORD,
    socket: {
      host: RD_HOST,
      port: RD_PORT,
    },
  });
}

export default client;
