import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, InputNumber, Radio, Space } from "antd";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis";
import { useLocation } from "react-router-dom";
import uuid from "react-uuid";

import {
  defaultEvents,
  defaultOptions,
  defaultUnweightedDirectedGraph,
  defaultWeightedDirectedGraph,
} from "../constants/DefaultDirectedGraphSettings";
import "../css/GraphWidget.css";
import { bfs, dfs, ucs } from "../utils/SearchAlgorithms";

export default function GraphWidget() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const location = useLocation();
  const isDefaultWeighted = location?.state?.isGraphWeighted;

  const [algorithm, setAlgorithm] = useState("");
  const [nodeToAdd, setNodeToAdd] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [nodeToDelete, setNodeToDelete] = useState("");
  const [nodeToDeleteFrom, setNodeToDeleteFrom] = useState("");
  const [nodeToDeleteTo, setNodeToDeleteTo] = useState("");
  const [searchStartNode, setSearchStartNode] = useState("");
  const [searchEndNode, setSearchEndNode] = useState("");
  const [editedGraph, setEditedGraph] = useState(
    isDefaultWeighted ? defaultWeightedDirectedGraph : defaultUnweightedDirectedGraph,
  );
  const [nodeIndexMapping, setNodeIndexMapping] = useState({});
  const [graph, setGraph] = useState(
    isDefaultWeighted ? defaultWeightedDirectedGraph : defaultUnweightedDirectedGraph,
  );
  const [nodes, setNodes] = useState([]);
  const [fromNodeToChangeWeight, setFromNodeToChangeWeight] = useState("");
  const [toNodeToChangeWeight, setToNodeToChangeWeight] = useState("");
  const [newEdgeWeight, setNewEdgeWeight] = useState();

  // Change these to state variables if needed
  const options = defaultOptions;
  const events = defaultEvents;

  useEffect(() => {
    if (editedGraph.nodes.length === 0) {
      return;
    }

    const nodeIndexMap = {};

    for (let i = 0; i < editedGraph.nodes.length; i++) {
      nodeIndexMap[editedGraph.nodes[i].id] = {
        index: i,
        label: editedGraph.nodes[i].label,
      };
    }

    const nodes = editedGraph.nodes.map((g) => ({
      label: g.label,
      key: g.id.toString(),
    }));

    setGraph(editedGraph);
    setNodeIndexMapping(nodeIndexMap);
    setNodes(nodes);
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
      console.log(currentEdges);
      const newEdges = [];
      for (let i = 0; i < currentEdges.length; i++) {
        if (!(currentEdges[i].from === nodeToDeleteFrom && currentEdges[i].to === nodeToDeleteTo)) {
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

  const changeEdgeWeight = () => {
    if (
      fromNodeToChangeWeight.length > 0 &&
      toNodeToChangeWeight.length > 0 &&
      newEdgeWeight >= 0
    ) {
      const newGraphObject = { ...graph };
      const currentEdges = newGraphObject.edges;
      const newEdges = [];
      for (let i = 0; i < currentEdges.length; i++) {
        if (
          currentEdges[i].from === fromNodeToChangeWeight &&
          currentEdges[i].to === toNodeToChangeWeight
        ) {
          const newEdge = {
            from: currentEdges[i].from,
            to: currentEdges[i].to,
            label: newEdgeWeight.toString(),
          };
          newEdges.push(newEdge);
        } else {
          newEdges.push(currentEdges[i]);
        }
      }
      newGraphObject.edges = newEdges;
      setEditedGraph(newGraphObject);
      setFromNodeToChangeWeight("");
      setToNodeToChangeWeight("");
    }
  };

  const onChangeAddedWeight = (value) => {
    setNewEdgeWeight(value);
  };

  const runSearch = () => {
    switch (algorithm) {
      case "dfs":
        dfs(searchStartNode, searchEndNode, graph, setEditedGraph);
        break;
      case "bfs":
        bfs(searchStartNode, searchEndNode, graph, setEditedGraph);
        break;
      case "ucs":
        ucs(searchStartNode, searchEndNode, graph, setEditedGraph);
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
    setSearchStartNode(e.key);
  };
  const handleToClick = (e) => {
    setSearchEndNode(e.key);
  };
  const handleChangeNodeFromWeight = (e) => {
    setFromNodeToChangeWeight(e.key);
  };
  const handleChangeNodeToWeight = (e) => {
    setToNodeToChangeWeight(e.key);
  };

  const changeNodeFromWeightMenuProps = {
    items: nodes,
    onClick: handleChangeNodeFromWeight,
  };

  const changeNodeToWeightMenuProps = {
    items: nodes,
    onClick: handleChangeNodeToWeight,
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

  const resetGraph = () => {
    // Reset state variables
    setSearchStartNode("");
    setSearchEndNode("");
    setFromNode("");
    setToNode("");
    setNodeToDelete("");
    setNodeToDeleteFrom("");
    setNodeToDeleteTo("");
    setFromNodeToChangeWeight("");
    setToNodeToChangeWeight("");

    if (isDefaultWeighted) {
      setEditedGraph(defaultWeightedDirectedGraph);
    } else {
      setEditedGraph(defaultUnweightedDirectedGraph);
    }
  };

  const resetColors = () => {
    const newGraphObject = { ...graph };
    const currentNodes = newGraphObject.nodes;
    const newNodes = currentNodes.map((currentNode) => {
      return {
        ...currentNode,
        color: "#97c2fc",
      };
    });

    newGraphObject.nodes = newNodes;
    setEditedGraph(newGraphObject);
  };

  return (
    <div className="grid-container" style={{ paddingTop: 100 }}>
      <div className="grid-item">
        <Graph
          graph={graph}
          options={{ ...options, height: "100%", width: "1000px" }}
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
                      {searchStartNode !== "" ? nodeIndexMapping[searchStartNode].label : "From"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Dropdown menu={searchToProps}>
                  <Button>
                    <Space>
                      {searchEndNode !== "" ? nodeIndexMapping[searchEndNode].label : "To"}
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
                  placeholder="Node label"
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

          {isDefaultWeighted ? (
            <Form.Item label="Change Edge Weight" name="changeEdgeWeight">
              <div className="grid-container-small">
                <div className="grid-item-small">
                  <Dropdown menu={changeNodeFromWeightMenuProps}>
                    <Button>
                      <Space>
                        {fromNodeToChangeWeight !== ""
                          ? nodeIndexMapping[fromNodeToChangeWeight].label
                          : "From"}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
                <div className="grid-item-small">
                  <Dropdown menu={changeNodeToWeightMenuProps}>
                    <Button>
                      <Space>
                        {toNodeToChangeWeight !== ""
                          ? nodeIndexMapping[toNodeToChangeWeight].label
                          : "To"}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
                <div className="grid-item-small">
                  <InputNumber
                    defaultValue={1}
                    value={newEdgeWeight}
                    onChange={onChangeAddedWeight}
                    placeholder="Edge weight"
                    style={{ width: 50 }}
                  />
                </div>
                <div className="grid-item-small">
                  <Button onClick={changeEdgeWeight}>Ok!</Button>
                </div>
              </div>
            </Form.Item>
          ) : null}

          <Form.Item label="Delete node" name="nodeName">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Dropdown menu={deleteNodeProps}>
                  <Button>
                    <Space>
                      {nodeToDelete !== "" ? nodeIndexMapping[nodeToDelete].label : "Node"}
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
                      {nodeToDeleteFrom !== "" ? nodeIndexMapping[nodeToDeleteFrom].label : "From"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                <Dropdown menu={deleteNodeToProps}>
                  <Button>
                    <Space>
                      {nodeToDeleteTo !== "" ? nodeIndexMapping[nodeToDeleteTo].label : "To"}
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
          <Form.Item>
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Button onClick={resetGraph} type="primary" htmlType="submit">
                  Reset Graph
                </Button>
              </div>
              <div className="grid-item-small">
                <Button onClick={resetColors} type="primary" htmlType="submit">
                  Reset Colors
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
