import api from "./api";

export const syncPositions = async (positions) => {
  const { data } = await api.post("sync-positions/", { positions });
  return data;
};
