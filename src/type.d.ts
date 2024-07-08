interface IUser {
  studentCode: string;
  studentName: string;
  studentClass: string;
  studentPhone: string;
  password: string;
  image?: string;
  role: "user" | "admin";
  isOnline?: boolean;
  status?: number;
}
