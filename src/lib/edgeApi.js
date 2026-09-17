import api from "./api";

export const createEdge = async (payload) => {
  const { data } = await api.post("edge/", payload);
  return data;
};

export const getEdges = async (projectUuid) => {
  // try project-filtered fetch first, fall back to global fetch
  const params = projectUuid ? { project: projectUuid } : {};
  const { data } = await api.get("edge/", { params });
  // backend may return paginated {results:[]} or direct []
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return data;
};

export const deleteEdge = async (id) => {
  await api.delete(`edge/${id}/`);
};

export const updateEdge = async (id, payload) => {
  const { data } = await api.patch(`edge/${id}/`, payload);
  return data;
};
