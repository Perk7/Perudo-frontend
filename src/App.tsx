import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './scrollToTop';

import Home from './components/Home';
import Room from './components/Room';
import NotFound from 'components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:name/:password" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;