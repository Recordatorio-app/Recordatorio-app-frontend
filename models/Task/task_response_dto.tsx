export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pendiente" | "realizada";
  reminderDate: string;
  colorKey: string;
}