const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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


// TODO: implement (depth first search)
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

// TODO: implement (uniform-cost search)
//Ref: https://gist.github.com/mishoo/1286920
function make_path(state, cost, parent) {
  return {
      state  : state,
      cost   : cost,
      parent : parent
  };
};
function write_path(path) {
  var s = "";
  if (path.parent) s = write_path(path.parent) + " => ";
  s += path.state + "(" + path.cost + ")";
  return s;
};
// find the index of the element in array `a` for which
// f(el) returns the smallest value.
function find_min(a, f) {
  var min = null, pos = null;
  for (var i = 0; i < a.length; ++i) {
      var el = f(a[i]);
      if (min === null || min > el) {
          min = el;
          pos = i;
      }
  }
  return pos;
};
// remove and return the path having the minimum cost
function remove_choice(frontier) {
  var index = find_min(frontier, function(path){
      return path.cost;
  });
  var it = frontier[index];
  frontier.splice(index, 1); // remove it
  return it;
};

export const ucs = async(start, goal, graph, setEditedGraph) => {
  //console.log(start.id);
  let frontier = [];
  frontier.push(make_path(start, 0, null));
  //frontier.push(makegoal);
  //console.log(frontier);
  var explored = new Set();

  while (frontier.length > 0) {
    frontier.forEach(element => 
      console.log("frontier:"+element.state));
    // remove the minumum cost and explore from it
    var path = remove_choice(frontier);
    console.log(write_path(path));

    explored.add(path.state);

    explored.forEach(element => 
      console.log("explored:"+element));
    // draw
    const newGraphObject = { ...graph };
    /*graph.nodes.forEach(element => 
      console.log("node:"+element.id));*/
      const newNodes = graph.nodes.map((nd) =>
      explored.has(nd.id)
        ? {
            ...nd,
            color: "orange",
          }
        : nd,
    );
    newGraphObject.nodes = newNodes;
    /*newGraphObject.nodes.forEach(element => 
      console.log("node:"+element.color));*/
    //console.log("new nodes:"+newGraphObject.nodes);
    setEditedGraph(newGraphObject);

    if (path.state === goal) 
    {
      console.log("goal");
      break;
    }
    // if not explored

    const neighbors = graph.edges.flatMap((edge) =>
      edge.from === path.state && !explored[edge.to] ? [edge.to] : [],
    );

    neighbors.forEach(element => 
      {
        console.log("neib:"+element);
        let total_cost = path.cost;
        if(element.cost != null)
        {
          total_cost = path.cost + element.cost;
        }else
        {
          total_cost = path.cost + 1;
        }
        var p = make_path(element, total_cost, path);
        frontier.push(p);
      }
      );

    // Wait half a second before the next step
    await sleep(500);
  }
};

