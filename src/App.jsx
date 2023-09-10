import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NFTPreview from "./pages/NFTPreview.jsx";
import Form from "./pages/Form.jsx";
import Marketplace from "./pages/Marketplace";
import { IPFSDataProvider } from "../IPFSDataContext";

const App = () => {
  return (
    <BrowserRouter>
      <IPFSDataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nftpreview/" element={<NFTPreview />} />
          <Route path="/form/" element={<Form />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </IPFSDataProvider>
    </BrowserRouter>
  );
};

export default App;
