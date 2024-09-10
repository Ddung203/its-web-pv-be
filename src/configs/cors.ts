import { ALLOWED_IP } from "./config";

const corsConfiguration = {
  origin: ALLOWED_IP,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export default corsConfiguration;
