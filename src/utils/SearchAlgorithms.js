const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const dfs = async (startNode, endNode, graph, setEditedGraph) => {
  const explored = new Set();
  let qq = [startNode];

  while (qq.length !== 0) {
    const newGraphObject = { ...graph };
    const node_id = qq.shift();
    explored.add(node_id);

    const newNodes = graph.nodes.map((nd) =>
      explored.has(nd.id)
        ? {
            ...nd,
            color: "orange",
          }
        : nd,
    );

    newGraphObject.nodes = newNodes;
    setEditedGraph(newGraphObject);

    // Break if found
    if (node_id === endNode) {
      break;
    }

    // Else, search neighbors
    const neighbors = graph.edges.flatMap((edge) =>
      edge.from === node_id && !explored.has(edge.to) ? [edge.to] : [],
    );

    qq = [...qq, ...neighbors];

    // Wait half a second before the next step
    await sleep(500);
  }
};


// TODO: implement (breadth first search)
export const bfs = async (startNode, endNode, graph, setEditedGraph) => {
  const explored = new Set();
  let frontier_queue = [startNode];

  while (frontier_queue.length !== 0) {
    const newGraphObject = { ...graph };
    const node_id = frontier_queue.shift();
    explored.add(node_id);

    const newNodes = graph.nodes.map((nd) =>
      explored.has(nd.id)
        ? {
            ...nd,
            color: "orange",
          }
        : nd,
    );

    newGraphObject.nodes = newNodes;
    setEditedGraph(newGraphObject);

    // Break if found
    if (node_id === endNode) {
      break;
    }

    // Else, search neighbors
    const neighbors = graph.edges.flatMap((edge) =>
      edge.from === node_id && !explored.has(edge.to) ? [edge.to] : [],
    );

    frontier_queue = [...neighbors, ...frontier_queue];

    // Wait half a second before the next step
    await sleep(500);
  }
};

// TODO: implement (uniform-cost search)
export const ucs = () => {};
