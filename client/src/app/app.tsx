import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppWrap from '@views/app';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppWrap />} />
        {/* <Route path="/list" element={<List />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
