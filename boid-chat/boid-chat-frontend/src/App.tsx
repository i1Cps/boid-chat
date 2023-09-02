import { Route, Routes } from "react-router-dom";
import Join from "./components/joinPage";
import MainPage from "./components/mainPage";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
