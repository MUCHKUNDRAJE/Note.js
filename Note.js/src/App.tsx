import Home from './routes/home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Note from './routes/note';


function App() {


  return (
   <>
      <Router>
      <Routes>
     
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<Note />} />
      </Routes>
    </Router>
   </>
  )
}

export default App
