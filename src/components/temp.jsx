import './App.css';
import Navbar from './components/Navbar';
import MainBody from './components/AdminContent';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './components/AdminForm';
import Login from './components/Login';
import Signup from './components/Signup';
import UserContent from './components/UserContent';
import MainPage from './components/MainPage';
import Footer from './components/Footer';
import UserBody from './components/userBody';
import UserApplied from './components/userApplied';
import JobApplyPage from './components/userApplicationPage/JobApplyPage';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <MainPage />
                <div className="main-body">
                  <UserContent islogged={false} />
                </div>
              </>
            } />
            <Route path="/userApplied" element={<UserApplied />} />
            <Route path="/admin" element={
              <>
                <div className="container">
                  <div className="main-body">
                    <MainBody />
                  </div>
                  <div className="form-section">
                    <Form />
                  </div>
                </div>
              </>
            } />
            <Route path='/user' element={<UserBody />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/apply/:jobId" element={<JobApplyPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
