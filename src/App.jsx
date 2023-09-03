import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NFTPreview from "./pages/NFTPreview.jsx"; // Make sure the spelling is correct
import Form from "./pages/Form.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nftpreview/" element={<NFTPreview />} /> 
        <Route path="/form/" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
