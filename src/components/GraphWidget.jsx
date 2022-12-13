import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis";
import uuid from "react-uuid";

import {
  defaultDirectedGraph,
  defaultEvents,
  defaultOptions,
} from "../constants/DefaultDirectedGraphSettings";
import "../css/GraphWidget.css";

export default function GraphWidget() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [algorithm, setAlgorithm] = useState("");
  const [network, setNetwork] = useState({});
  const [nodeToAdd, setNodeToAdd] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [nodeToDelete, setNodeToDelete] = useState("");
  const [nodeToDeleteFrom, setNodeToDeleteFrom] = useState("");
  const [nodeToDeleteTo, setNodeToDeleteTo] = useState("");
  const [startNode, setNodeToStartFrom] = useState("");
  const [endNode, setNodeToEndTo] = useState("");
  const [editedGraph, setEditedGraph] = useState(defaultDirectedGraph);
  const [nodeIndexMapping, setNodeIndexMapping] = useState({});
  const [graph, setGraph] = useState(defaultDirectedGraph);

  // Change these to state variables if needed
  const options = defaultOptions;
  const events = defaultEvents;

  const nodes = graph.nodes.map((g) => ({
    label: g.label,
    key: g.id.toString(),
  }));

  useEffect(() => {
    const nodeMap = {};
    if (editedGraph?.nodes.length > 0) {
      for (let i = 0; i < editedGraph.nodes.length; i++) {
        nodeMap[editedGraph.nodes[i].id] = {
          index: i,
          label: editedGraph.nodes[i].label,
        };
      }
    }
    setNodeIndexMapping(nodeMap);
  }, [editedGraph.nodes]);

  useEffect(() => {
    if (editedGraph.nodes.length > 0) {
      setGraph(editedGraph);
    }
  }, [editedGraph]);

  const onChangeAddedNode = (value) => {
    setNodeToAdd(value);
  };

  const addNode = () => {
    if (nodeToAdd.length > 0 && graph.nodes.length > 0) {
      const newNode = {
        id: uuid(),
        label: nodeToAdd,
        title: nodeToAdd,
      };
      const newGraphObject = { ...graph };
      const newNodes = [...newGraphObject.nodes, newNode];
      newGraphObject.nodes = newNodes;
      setEditedGraph(newGraphObject);
    }
  };

  const addEdge = () => {
    if (fromNode.length > 0 && toNode.length > 0) {
      const newEdge = { from: fromNode, to: toNode };
      const newGraphObject = { ...graph };
      const newEdges = [...newGraphObject.edges, newEdge];
      newGraphObject.edges = newEdges;
      setEditedGraph(newGraphObject);
      setFromNode("");
      setToNode("");
    }
  };

  const deleteEdge = () => {
    if (nodeToDeleteFrom.length > 0 && nodeToDeleteTo.length > 0) {
      const newGraphObject = { ...graph };
      const currentEdges = [...newGraphObject.edges];
      const newEdges = [];
      for (let i = 0; i < currentEdges.length; i++) {
        if (currentEdges[i].from !== nodeToDeleteFrom && currentEdges[i].to !== nodeToDeleteTo) {
          newEdges.push(currentEdges[i]);
        }
      }
      newGraphObject.edges = newEdges;
      setEditedGraph(newGraphObject);
      setNodeToDeleteFrom("");
      setNodeToDeleteTo("");
    }
  };

  //weird bug when i just try to splice the list, i dunno why
  const deleteNode = () => {
    if (nodeToDelete.length > 0 && graph.nodes.length > 0) {
      const newGraphObject = { ...graph };
      const currentNodes = newGraphObject.nodes;
      const currentEdges = newGraphObject.edges;
      const newEdges = [];
      const newNodes = [];

      for (let i = 0; i < currentEdges.length; i++) {
        if (currentEdges[i].from !== nodeToDelete) {
          newEdges.push(currentEdges[i]);
        }
      }

      for (let i = 0; i < currentNodes.length; i++) {
        if (currentNodes[i].id !== nodeToDelete) {
          newNodes.push(currentNodes[i]);
        }
      }

      newGraphObject.nodes = newNodes;
      newGraphObject.edges = newEdges;

      setEditedGraph(newGraphObject);
      setNodeToDelete("");
    }
  };

  const dfs = () => {
    const newGraphObject = { ...graph };
    const explored = new Set();
    let qq = [];
    qq.push(startNode);

    while (qq.length !== 0) {
      const node_id = qq.shift();
      explored.add(node_id);

      // Break if found
      if (node_id === endNode) {
        break;
      }

      // Else, search neighbors
      const neighbors = graph.edges.flatMap((edge) =>
        edge.from === node_id && !explored.has(edge.to) ? [edge.to] : [],
      );

      qq = [...qq, ...neighbors];
    }

    const newNodes = graph.nodes.map((nd) =>
      explored.has(nd.id)
        ? {
            id: nd.id,
            label: nd.label,
            title: nd.title,
            color: "orange",
          }
        : nd,
    );
    newGraphObject.nodes = newNodes;
    setEditedGraph(newGraphObject);
  };

  // TODO: implement (breadth first search)
  const bfs = () => {};

  // TODO: implement (uniform-cost search)
  const ucs = () => {};

  const runSearch = () => {
    switch (algorithm) {
      case "dfs":
        dfs();
        break;
      case "bfs":
        bfs();
        break;
      case "ucs":
        ucs();
        break;
      default:
        console.error("Invalid algorithm.");
        break;
    }
  };

  const handleMenuFromClick = (e) => {
    setFromNode(e.key);
  };
  const handleMenuToClick = (e) => {
    setToNode(e.key);
  };
  const handleDeleteNodeClick = (e) => {
    setNodeToDelete(e.key);
  };
  const handleDeleteNodeFromClick = (e) => {
    setNodeToDeleteFrom(e.key);
  };
  const handleDeleteNodeToClick = (e) => {
    setNodeToDeleteTo(e.key);
  };
  const handleFromClick = (e) => {
    setNodeToStartFrom(e.key);
  };
  const handleToClick = (e) => {
    setNodeToEndTo(e.key);
  };

  const nodeFromMenuProps = {
    items: nodes,
    onClick: handleMenuFromClick,
  };

  const nodeToMenuProps = {
    items: nodes,
    onClick: handleMenuToClick,
  };

  const deleteNodeProps = {
    items: nodes,
    onClick: handleDeleteNodeClick,
  };

  const deleteNodeFromProps = {
    items: nodes,
    onClick: handleDeleteNodeFromClick,
  };

  const deleteNodeToProps = {
    items: nodes,
    onClick: handleDeleteNodeToClick,
  };

  const searchFromProps = {
    items: nodes,
    onClick: handleFromClick,
  };

  const searchToProps = {
    items: nodes,
    onClick: handleToClick,
  };

  const changeNodeColor = (nodeId, color) => {
    if (Object.keys(network.network).length > 0) {
      network.network.body.nodes[nodeId].options.color.background = color;
    }
  };

  return (
    <div className="grid-container" style={{ paddingTop: 100 }}>
      <div className="grid-item">
        <Graph
          graph={graph}
          options={{ ...options, height: "100%", width: "1000px" }}
          getNetwork={(network) => setNetwork({ network })}
          events={events}
        />
      </div>
      <div className="grid-item">
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Algorithm" name="algorithm">
            <Radio.Group onChange={(e) => setAlgorithm(e.target.value)} value={algorithm}>
              <Radio.Button value="dfs">DFS</Radio.Button>
              <Radio.Button value="bfs">BFS</Radio.Button>
              <Radio.Button value="ucs">UCS</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="From/To" name="from/to">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Dropdown menu={searchFromProps}>
                  <Button>
                    <Space>
                      {startNode !== "" ? nodeIndexMapping[startNode]?.label : "From"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Dropdown menu={searchToProps}>
                  <Button>
                    <Space>
                      {endNode !== "" ? nodeIndexMapping[endNode]?.label : "To"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Button onClick={runSearch}>Search!</Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="Add node" name="nodeName">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Input
                  value={nodeToAdd}
                  onChange={(e) => onChangeAddedNode(e.target.value)}
                  onPressEnter={addNode}
                />
              </div>
              <div className="grid-item-small">
                <Button onClick={addNode}>Ok!</Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="Add edge" name="addEdge">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Dropdown menu={nodeFromMenuProps}>
                  <Button>
                    <Space>
                      {fromNode !== "" ? nodeIndexMapping[fromNode].label : "From"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Dropdown menu={nodeToMenuProps}>
                  <Button>
                    <Space>
                      {toNode !== "" ? nodeIndexMapping[toNode].label : "To"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Button onClick={addEdge}>Ok!</Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="Delete node" name="nodeName">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Dropdown menu={deleteNodeProps}>
                  <Button>
                    <Space>
                      {nodeToDelete !== "" ? nodeIndexMapping[nodeToDelete]?.label : "Nodes"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Button onClick={deleteNode}>Ok!</Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="Delete edge" name="deleteEdge">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Dropdown menu={deleteNodeFromProps}>
                  <Button>
                    <Space>
                      {nodeToDeleteFrom !== "" ? nodeIndexMapping[nodeToDeleteFrom]?.label : "From"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Dropdown menu={deleteNodeToProps}>
                  <Button>
                    <Space>
                      {nodeToDeleteTo !== "" ? nodeIndexMapping[nodeToDeleteTo]?.label : "To"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Button onClick={deleteEdge}>Ok!</Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
