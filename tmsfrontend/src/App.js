
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Auth from './pages/auth';
import NotFound from './pages/notFound';
import UnAuthorized from './pages/unauthorized';

function App() {
  return (
    <div className="App">

      <Router>



        <Routes>

          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />


        </Routes>




      </Router>
    </div>
  );
}

export default App;
