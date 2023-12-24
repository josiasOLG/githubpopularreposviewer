import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; // Importe o Provider do react-redux

import UserPage from "./components/pages/UserPage";
import RepoDetailsPage from "./components/pages/RepoDetailsPage";
import Layout from "./components/templates/Layout";
import { store } from "./redux/store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="" element={<UserPage />} />
            <Route path="/repo/:name/:fullName" element={<RepoDetailsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
