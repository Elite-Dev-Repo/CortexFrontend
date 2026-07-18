import api from "./api"

export const getTasks = async () => {
  const { data } = await api.get("/tasks/")
  return data
}

export const getTask = async (id) => {
  const { data } = await api.get(`/task/${id}/`)
  return data
}

export const createTask = async (task) => {
  const { data } = await api.post("/tasks/", task)
  return data
}

export const updateTask = async (id, task) => {
  const { data } = await api.patch(`/task/${id}/`, task)
  return data
}

export const deleteTask = async (id) => {
  await api.delete(`/task/${id}/`)
}
