import { getProject } from "./projectsApi";

let data;
export const getProjectDataasNodes = async (projectUUid) => {
  const res = await getProject(projectUUid);
  data = await res;

  const nodes = [
    {
      id: String(res.id),
      data: { name: res.name, description: res.description, status: res.status },
      position: { x: 40, y: 60 },
      type: "projectNode",
    },
    ...(res.features?.map((feature, idx) => ({
      id: String(feature.id),
      data: {
        name: feature.name,
        description: feature.description,
        tags: feature.tags,
        status: feature.status,
      },
      position: { x: 320, y: idx * 140 + 20 },
      type: "featureNode",
    })) ?? []),
  ];

  return nodes;
};
