import api from "../api";

export const saveFCMToken = async (token: string) => {
  const res = api.post("/notifications/token", { token });

  return res;
};
