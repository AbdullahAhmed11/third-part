import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./component/MainLayout";
import University from "./pages/University";
import Doctors from "./pages/Doctors";
import Courses from "./pages/Courses";
import Exams from "./pages/Exams";
import Lectures from "./pages/Lectures";
import QrCode from "./pages/QrCode";
import Ads from "./pages/Ads";
import Chat from "./pages/Chat";
import Rooms from "./pages/Rooms";
import Articles from "./pages/Articles";
import Students from "./pages/Students";
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={ <Layout> <Home /> </Layout> } />
        <Route path="/universities" element={ <Layout> <University /> </Layout> } />
        <Route path="/doctors" element={ <Layout> <Doctors /> </Layout> } />
        <Route path="/courses" element={ <Layout> <Courses /> </Layout> } />
        <Route path="/exams" element={ <Layout> <Exams /> </Layout> } />
        <Route path="/lectures" element={ <Layout> <Lectures /> </Layout> } />
        <Route path="/qr-code" element={ <Layout> <QrCode /> </Layout> } />
        <Route path="/ads" element={ <Layout> <Ads /> </Layout> } />
        <Route path="/chat" element={ <Layout> <Chat /> </Layout> } />
        <Route path="/rooms" element={ <Layout> <Rooms /> </Layout> } />
        <Route path="/articles" element={ <Layout> <Articles /> </Layout> } />
        <Route path="/students" element={ <Layout> <Students /> </Layout> } />
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
