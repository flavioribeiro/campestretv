import { Routes, Route } from "react-router-dom";

import Content from "./components/content";
import Header from "./components/header";
import Navigation from "./components/navigation";

import courts from "./assets/data/courts";

import "./styles/index.scss";

const App = () => {
  console.log("setting up routes for courts");
  const navRoutes = courts.map((court) => (
    <Route
      key={`${court.id}`}
      path={`quadra/${court.id}`}
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
