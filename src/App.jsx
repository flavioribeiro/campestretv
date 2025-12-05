import { Routes, Route } from "react-router-dom";

import Content from "./components/content";
import Header from "./components/header";
import Navigation from "./components/navigation";

import live from "./assets/data/live.json";

import "./styles/index.scss";

const App = () => {
  console.log("setting up routes for courts");
  const navRoutes = live.map((court) => (
    <Route
      key={`${court.id}`}
      path={`live/${court.id}`}
      element={<Content props={court.id} />}
    />
  ));
  return (
    <div className="app">
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<Content props={1} />} />
          {navRoutes}
        </Routes>
        <Navigation />
      </div>
    </div>
  );
};

export default App;
