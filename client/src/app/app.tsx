/* eslint-disable @typescript-eslint/no-unused-expressions */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppWrap from '@views/app';
import { useEffect } from 'react';

export function App() {
  useEffect(() => {
    document.addEventListener('contextmenu', function (event) {
      // util?.mouseRight ? util.mouseRight(event) : null;
      event.preventDefault();
    });
  }, []);

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
