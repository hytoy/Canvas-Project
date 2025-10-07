import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CanvasEditor from "./pages/canvasEditor";

function App() {
   return (
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
      </Routes>
   );
}

export default App;
