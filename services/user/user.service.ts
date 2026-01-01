import { ColorPalette } from "@/models/User/user_response_dto";
import api from "../api";

export const getUserPalette = async (userId: string) => {
  const res = await api.get(`/users/${userId}/palette`);
  return res.data.palette;
};

export const updateUserPalette = async (userId: string, palette: ColorPalette) => {
  const res = await api.put(`/users/${userId}/palette`, palette );
  return res.data.palette;
}
