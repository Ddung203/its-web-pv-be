interface IConfig {
  ENVIRONMENT: Environment;
  PORT: number | string;
  API_VERSION: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  ALLOWED_IP: any;
  API_KEY: string;
  RD_PASSWORD: string;
  RD_HOST: string;
  RD_PORT: any;
}

type Environment = "development" | "production";

interface IUser {
  studentCode: string;
  studentName: string;
  studentClass: string;
  studentPhone: string;
  studentHometown?: string;
  studentEmail?: string;
  studentFacebook?: string;
  image?: string;
  password: string;
  role: "user" | "admin" | "interviewer" | "guest";
  isTested?: number;
  isInterviewed?: number;
  isPassed?: number;
  isReceivedMail?: number;
}

interface IQuestion {
  code: any;
  imageURL: string;
  content: string;
  options: [
    {
      numbering: number;
      answer: string;
    },
  ];
  correctAnswer: number;
  level: "easy" | "normal" | "medium" | "hard";
}

interface IPlay {
  userID: any;
  timeOut: Date;
  score: number;
  interviewScore: number;
  totalScore: number;
  interviewer: string;
  comment: string;
  endTime: any;
}

interface IStat {
  websiteViews: number;
}
