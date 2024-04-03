import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const { loading } = useSelector((state) => state.alert);

  return (
    <div>
      {loading && <div>Loading ...</div>}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
