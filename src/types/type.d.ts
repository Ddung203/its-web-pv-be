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
}
