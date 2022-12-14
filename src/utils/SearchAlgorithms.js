const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Breadth-first search
export const bfs = async (startNode, endNode, graph, setEditedGraph) => {
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

// Depth-first search
export const dfs = async (startNode, endNode, graph, setEditedGraph) => {
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

const make_path = (state, cost, parent) => {
  return {
    state,
    cost,
    parent,
  };
};

const write_path = (path) => {
  let s = "";

  if (path.parent) {
    s = write_path(path.parent) + " => ";
  }

  return s + path.state + "(" + path.cost + ")";
};

// Find the index of the element in array `a` for which f(el) returns the smallest value.
const find_min = (a, f) => {
  let min = null;
  let pos = null;

  for (let i = 0; i < a.length; ++i) {
    let el = f(a[i]);
    if (min === null || min > el) {
      min = el;
      pos = i;
    }
  }
  return pos;
};

// Remove and return the path having the minimum cost
const remove_choice = (frontier) => {
  const index = find_min(frontier, function (path) {
    return path.cost;
  });
  const it = frontier[index];
  frontier.splice(index, 1); // remove it
  return it;
};

// Uniform-cost search. Reference: https://gist.github.com/mishoo/1286920
export const ucs = async (start, goal, graph, setEditedGraph) => {
  let frontier = [];
  let explored = new Set();

  frontier.push(make_path(start, 0, null));

  while (frontier.length > 0) {
    frontier.forEach((element) => console.log("frontier:" + element.state));
    // remove the minumum cost and explore from it
    const path = remove_choice(frontier);
    console.log(write_path(path));

    explored.add(path.state);

    explored.forEach((element) => console.log("explored:" + element));
    // draw
    const newGraphObject = { ...graph };

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

    if (path.state === goal) {
      console.log("goal");
      break;
    }

    const neighbors = graph.edges.flatMap((edge) =>
      edge.from === path.state && !explored[edge.to] ? [edge.to] : [],
    );

    neighbors.forEach((element) => {
      console.log("neib:" + element);
      let total_cost = path.cost;

      if (element.cost != null) {
        total_cost = path.cost + element.cost;
      } else {
        total_cost = path.cost + 1;
      }

      frontier.push(make_path(element, total_cost, path));
    });

    // Wait half a second before the next step
    await sleep(500);
  }
};
