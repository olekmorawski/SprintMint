import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NFTPreview from "./pages/NFTPreview.jsx";
import Form from "./pages/Form.jsx";
import { IPFSDataProvider } from "../IPFSDataContext";

const App = () => {
  return (
    <BrowserRouter>
      <IPFSDataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nftpreview/" element={<NFTPreview />} />
          <Route path="/form/" element={<Form />} />
        </Routes>
      </IPFSDataProvider>
    </BrowserRouter>
  );
};

export default App;
