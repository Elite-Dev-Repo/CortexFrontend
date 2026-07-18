import api from "./api"

export const getWorkspaces = async () => {
  const { data } = await api.get("/workspaces/")
  return data
}

export const getWorkspace = async (id) => {
  const { data } = await api.get(`/workspace/${id}/`)
  return data
}

export const createWorkspace = async (workspace) => {
  const { data } = await api.post("/workspaces/", workspace)
  return data
}

export const updateWorkspace = async (id, workspace) => {
  const { data } = await api.patch(`/workspace/${id}/`, workspace)
  return data
}

export const deleteWorkspace = async (id) => {
  await api.delete(`/workspace/${id}/`)
}
