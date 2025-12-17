import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wrapped from './pages/Wrapped';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* The Story Experience */}
          <Route path="/wrapped/:teamId/:gw" element={<Wrapped />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;