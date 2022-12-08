import { Layout } from "antd";
import { Container, Navbar, Nav } from "react-bootstrap";
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GraphVisualizer from "./components/GraphVisualizer";
import GraphWidget from "./components/GraphWidget";
const { Header, Content, Footer } = Layout;
export default function App() {
  return (
    <>
     <BrowserRouter>
      <Layout>
        <Navbar bg="dark" variant="dark" fixed="top">
          <Container>
            <Navbar.Brand href="/">
              <img
                alt=""
                src="../../images/images.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              Search Algorithm Visualizer
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#features">Onboarding</Nav.Link>
              <Nav.Link href="#pricing">About</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </Layout>
     
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/visualizer" element={<GraphVisualizer />}></Route>
          <Route path ="/graph" element = {<GraphWidget/>}> </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
