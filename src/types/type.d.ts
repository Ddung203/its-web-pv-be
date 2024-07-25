interface IUser {
  studentCode: string;
  studentName: string;
  studentClass: string;
  studentPhone: string;
  studentHometown: string;
  password: string;
  image?: string;
  role: "user" | "admin" | "interviewer" | "guest";
  isOnline?: boolean;
  status?: number;
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
  questions: [
    {
      questionID: any;
      answered: boolean;
      answer: number;
    },
  ];
  timeOut: Date;
  totalScore: number;
  score: number;
  interviewScore: number;
  interviewer: string;
  comment: string;
  isInterviewed: boolean;
}
