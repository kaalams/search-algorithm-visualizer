import uuid from "react-uuid";

const initialUuids = [uuid(), uuid(), uuid(), uuid(), uuid()];

export const defaultDirectedGraph = {
  nodes: [
    {
      id: initialUuids[0],
      label: "Node 1",
      title: "node 1 tootip text",
      color: "#97c2fc",
    },
    {
      id: initialUuids[1],
      label: "Node 2",
      title: "node 2 tootip text",
      color: "#97c2fc",
    },
    {
      id: initialUuids[2],
      label: "Node 3",
      title: "node 3 tootip text",
      color: "#97c2fc",
    },
    {
      id: initialUuids[3],
      label: "Node 4",
      title: "node 4 tootip text",
      color: "#97c2fc",
    },
    {
      id: initialUuids[4],
      label: "Node 5",
      title: "node 5 tootip text",
      color: "#97c2fc",
    },
  ],
  edges: [
    { from: initialUuids[0], to: initialUuids[2] },
    { from: initialUuids[1], to: initialUuids[3] },
    { from: initialUuids[2], to: initialUuids[4] },
    { from: initialUuids[2], to: initialUuids[1] },
  ],
};

export const defaultOptions = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "#000000",
  },
  height: "500px",
};

export const defaultEvents = {
  select: function (event) {
    const { nodes, edges } = event;
    console.log(nodes);
    console.log(edges);
  },
};
