import api from "./api"

export const getFeatures = async () => {
  const { data } = await api.get("/features/")
  return data
}

export const getFeature = async (id) => {
  const { data } = await api.get(`/feature/${id}/`)
  return data
}

export const createFeature = async (feature) => {
  const { data } = await api.post("/features/", feature)
  return data
}

export const updateFeature = async (id, feature) => {
  const { data } = await api.patch(`/feature/${id}/`, feature)
  return data
}

export const deleteFeature = async (id) => {
  await api.delete(`/feature/${id}/`)
}
