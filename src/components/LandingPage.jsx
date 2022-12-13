import { Button } from "antd";
import { Link } from "react-router-dom";

import "../css/LandingPage.css";

export default function LandingPage() {
  return (
    <div
      style={{
        paddingTop: 200,
        minHeight: 1250,
        margin: "auto",
        textAlign: "center",
        backgroundColor: "transparent",
      }}
    >
      <h1 style={{ fontSize: 65 }}>Welcome to the Search Algorithm Visualizer Tool</h1>
      <Link to="/visualizer">
        <Button type="primary" size="large">
          Let's Get Started
        </Button>
      </Link>
    </div>
  );
}
