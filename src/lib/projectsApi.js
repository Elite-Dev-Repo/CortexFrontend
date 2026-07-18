import api from "./api"

export const getProjects = async () => {
  const { data } = await api.get("/projects/")
  return data
}

export const getProject = async (id) => {
  const { data } = await api.get(`/project/${id}/`)
  return data
}

export const createProject = async (project) => {
  const { data } = await api.post("/projects/", project)
  return data
}

export const updateProject = async (id, project) => {
  const { data } = await api.patch(`/project/${id}/`, project)
  return data
}

export const deleteProject = async (id) => {
  await api.delete(`/project/${id}/`)
}
