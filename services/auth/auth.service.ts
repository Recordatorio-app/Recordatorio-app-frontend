import { LoginRequestDTO, RegisterRequestDTO } from "@/models/User/user_request_dto";
import api from "../api";

export const loginUser = async (data: LoginRequestDTO) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

export const registerUser = async (data: RegisterRequestDTO) => {
  const res = await api.post("/users/register", data);
  return res.data;
};
