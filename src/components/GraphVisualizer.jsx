import { Button, Form, Switch } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function GraphVisualizer() {
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);

  const onChangeDirected = (checked) => {
    setIsDirected(checked);
  };

  const onChangeWeighted = (checked) => {
    setIsWeighted(checked);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        paddingTop: 200,
        minHeight: 1250,
        margin: "auto",

        backgroundColor: "transparent",
        maxWidth: 700,
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={{ textAlign: "center", paddingBottom: 20 }}>
          <h1>Graph Settings</h1>
        </div>

        <Form.Item
          label="Is your graph directed?"
          name="isDirected"
          rules={[{ required: true, message: "Please answer!" }]}
        >
          <Switch onChange={onChangeDirected} />
        </Form.Item>

        <Form.Item
          label="Is your graph weighted?"
          name="isWeighted"
          rules={[{ required: true, message: "Please answer!" }]}
        >
          <Switch onChange={onChangeWeighted} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Link to="/graph" state={{ isGraphWeighted: isWeighted, isGraphDirected: isDirected }}>
            <Button type="primary" htmlType="submit">
              Generate graph!
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
}
