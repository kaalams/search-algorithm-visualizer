import { Button, Form, Input, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import { useLocation } from "react-router-dom";
import Graph from "react-graph-vis";
import "./css/GraphWidget.css";
import {defaultDirectedGraph, defaultOptions, defaultEvents} from "./DefaultDirectedGraphSettings"

export default function GraphWidget(props) {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [nodeToAdd, setNodeToAdd] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [nodeToDelete, setNodeToDelete] = useState("");
  const [nodeToDeleteFrom, setNodeToDeleteFrom] = useState("");
  const [nodeToDeleteTo, setNodeToDeleteTo] = useState("");
  const [editedGraph, setEditedGraph] = useState(defaultDirectedGraph);
  const [nodeIndexMapping, setNodeIndexMapping] = useState({});
  const [graph, setGraph] = useState(defaultDirectedGraph);
  const [options, setOptions] = useState(defaultOptions);
  const [events, setEvents] = useState(defaultEvents);

  const nodes = graph.nodes.map((g) => ({
    label: g.label,
    key: g.id.toString(),
  }));

  useEffect(() => {
    const nodeMap = {};
    if (editedGraph.nodes.length > 0) {
      for (let i = 0; i < editedGraph.nodes.length; i++) {
        nodeMap[editedGraph.nodes[i].id] = {index: i, label: editedGraph.nodes[i].label};
      }
    }
    setNodeIndexMapping(nodeMap);
  }, [JSON.stringify(editedGraph.nodes)]);

  useEffect(() => {
    if (editedGraph.nodes.length > 0) {
      setGraph(editedGraph);
    }
  }, [JSON.stringify(editedGraph.nodes), JSON.stringify(editedGraph.edges)]);

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
      const newEdge = {from: fromNode, to: toNode};
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
      const newEdges = []
      for(let i = 0; i < currentEdges.length; i++) {
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
      const newGraphObject = {...graph}
      const currentNodes = newGraphObject.nodes;
      const currentEdges = newGraphObject.edges;
      const newEdges = []
      const newNodes = []
      for(let i = 0; i < currentEdges.length; i++) {
        if (currentEdges[i].from !== nodeToDelete) {
          newEdges.push(currentEdges[i])
        }
      }
      for(let i = 0; i < currentNodes.length; i++) {
        if (currentNodes[i].id !== nodeToDelete) {
          newNodes.push(currentNodes[i])
        }
      }
      newGraphObject.nodes = newNodes;
      newGraphObject.edges = newEdges;
      setEditedGraph(newGraphObject)
      setNodeToDelete("")
    }
  };

  const handleMenuFromClick = (e) => {
    setFromNode(e.key)
  }
  const handleMenuToClick = (e) => {
    setToNode(e.key)
  }
  const handleDeleteNodeClick = (e) => {
    setNodeToDelete(e.key)
  }
  const handleDeleteNodeFromClick = (e) => {
    setNodeToDeleteFrom(e.key)
  }
  const handleDeleteNodeToClick = (e) => {
    setNodeToDeleteTo(e.key)
  }


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
  }

  const deleteNodeFromProps = {
    items: nodes,
    onClick: handleDeleteNodeFromClick,
  }

  const deleteNodeToProps = {
    items: nodes,
    onClick: handleDeleteNodeToClick,
  }

  return (
    <div className="grid-container" style={{ paddingTop: 200 }}>
      <div className="grid-item">
        <Graph graph={graph} options={options} events={events}></Graph>
      </div>
      <div className="grid-item">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="Add node" name="nodeName">
            <div className="grid-container-small">
              <div className="grid-item-small">
                <Input
                  value={nodeToAdd}
                  onChange={(e) => onChangeAddedNode(e.target.value)}
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
                {" "}
                <Dropdown menu={nodeFromMenuProps}>
                  <Button>
                    <Space>
                      {fromNode != "" ? nodeIndexMapping[fromNode].label : "From"} 
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
              <Dropdown menu={nodeToMenuProps}>
                  <Button>
                    <Space>
                    {toNode != "" ? nodeIndexMapping[toNode].label : "To"} 
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
                {" "}
               <Dropdown menu={deleteNodeProps}>
                  <Button>
                    <Space>
                      {nodeToDelete != "" ? nodeIndexMapping[nodeToDelete]?.label : "Nodes"} 
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
                {" "}
                <Dropdown menu={deleteNodeFromProps}>
                  <Button>
                    <Space>
                      {nodeToDeleteFrom != "" ? nodeIndexMapping[nodeToDeleteFrom]?.label : "From"} 
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
              <div className="grid-item-small">
                {" "}
                <Dropdown menu={deleteNodeToProps}>
                    <Button>
                      <Space>
                        {nodeToDeleteTo != "" ? nodeIndexMapping[nodeToDeleteTo]?.label : "To"} 
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

  

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          ></Form.Item>
        </Form>
      </div>
    </div>
  );
}


