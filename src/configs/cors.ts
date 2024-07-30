import { ALLOWED_IP } from "./config";

const corsConfiguration = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export default corsConfiguration;
