import { BrowserRouter, Routes, Route } from "react-router-dom";
import FEdit from "./Pages/";
import Overlay from "./Pages/Football/";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/overlay/" element={<Overlay />} />
        <Route path="/" element={<FEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
