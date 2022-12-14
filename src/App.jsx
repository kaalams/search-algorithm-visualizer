import { Layout } from "antd";
import { Container, Navbar } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GraphVisualizer from "./components/GraphVisualizer";
import GraphWidget from "./components/GraphWidget";
import LandingPage from "./components/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Navbar bg="dark" variant="dark" fixed="top">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src="../../images/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Search Algorithm Visualizer
            </Navbar.Brand>
          </Container>
        </Navbar>
      </Layout>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/visualizer" element={<GraphVisualizer />} />
        <Route path="/graph" element={<GraphWidget />} />
      </Routes>
    </BrowserRouter>
  );
}
