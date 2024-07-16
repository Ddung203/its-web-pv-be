import { ALLOWED_IP } from "./config";

const corsConfiguration = {
  origin: ["http://localhost:4173", "http://localhost:5173", "https://its-interview.vercel.app/", ALLOWED_IP],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export default corsConfiguration;
