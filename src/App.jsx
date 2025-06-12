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
import DoctorProfile from "./pages/DoctorProfile";
import CourseLectures from "./pages/CourseLectures";
import ExamView from "./pages/ExamView";
import StudentView from "./pages/StudentView";
import RequireAuth from "./component/RequireAuth";
import HomeDR from "./pages/HomeDR";
import CoursesDR from "./pages/CoursesDR";
import LectureLesson from "./pages/LectureLesson";
import StudetnsCourse from "./pages/StudetnsCourse";
function App() {
  return (
    <>
    <Router>


      <Routes>
      <Route path="/" 
        element={<RequireAuth>
        <Layout>
          <Home />
        </Layout>
      </RequireAuth>
      }
      />

 <Route
    path="/universities"
    element={
      <RequireAuth>
        <Layout>
          <University />
        </Layout>
      </RequireAuth>
    }
  />        
<Route
    path="/doctors"
    element={
      <RequireAuth>
        <Layout>
          <Doctors />
        </Layout>
      </RequireAuth>
    }
  />
 <Route
    path="/doctor/:id"
    element={
      <RequireAuth>
        <Layout>
          <DoctorProfile />
        </Layout>
      </RequireAuth>
    }
  />
       <Route
    path="/courses"
    element={
      <RequireAuth>
        <Layout>
          <Courses />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/course/:id"
    element={
      <RequireAuth>
        <Layout>
          <CourseLectures />
        </Layout>
      </RequireAuth>
    }
  />


    <Route
    path="/courseStudents/:id"
    element={
      <RequireAuth>
        <Layout>
          <StudetnsCourse/>
        </Layout>
      </RequireAuth>
    }
  />
        
      <Route
    path="/exams"
    element={
      <RequireAuth>
        <Layout>
          <Exams />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/exam/:id"
    element={
      <RequireAuth>
        <Layout>
          <ExamView />
        </Layout>
      </RequireAuth>
    }
  />


     <Route
    path="/lectures"
    element={
      <RequireAuth>
        <Layout>
          <Lectures />
        </Layout>
      </RequireAuth>
    }
  />
     <Route
    path="/lecture/:id"
    element={
      <RequireAuth>
        <Layout>
          <LectureLesson/>
        </Layout>
      </RequireAuth>
    }
  />


  <Route
    path="/qr-code"
    element={
      <RequireAuth>
        <Layout>
          <QrCode />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/ads"
    element={
      <RequireAuth>
        <Layout>
          <Ads />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/chat"
    element={
      <RequireAuth>
        <Layout>
          <Chat />
        </Layout>
      </RequireAuth>
    }
  />
     <Route
    path="/rooms"
    element={
      <RequireAuth>
        <Layout>
          <Rooms />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/articles"
    element={
      <RequireAuth>
        <Layout>
          <Articles />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/students"
    element={
      <RequireAuth>
        <Layout>
          <Students />
        </Layout>
      </RequireAuth>
    }
  />
  <Route
    path="/student/:id"
    element={
      <RequireAuth>
        <Layout>
          <StudentView />
        </Layout>
      </RequireAuth>
    }
  />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* dr role  */}
      <Route path="/homedr" 
        element={<RequireAuth>
        <Layout>
          <HomeDR />
        </Layout>
      </RequireAuth>
      }
      />

             <Route
    path="/coursesdr"
    element={
      <RequireAuth>
        <Layout>
        <CoursesDR/>
        </Layout>
      </RequireAuth>
    }
  />
      </Routes>
    </Router>
    
    </>
  );
}

export default App;
