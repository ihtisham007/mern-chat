import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import About from './components/About';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://192.168.10.14:4000');
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          <Route path="/about" element={<About />} ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;