// components/Sidebar.jsx
import { 
  FaHome, 
  FaUser, 
  FaCog, 
  FaEnvelope, 
  FaChartBar, 
  FaBars,
  FaBook,
  FaFileAlt,
  FaVideo,
  FaUserGraduate,
  FaNewspaper,
  FaDoorOpen,
  FaComments,
  FaBullhorn,
  FaQrcode
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  // Map of sidebar items with their paths
  const sidebarItems = [
    { icon: <FaHome />, text: "Dashboard", path: "/" },
    { icon: <FaUser />, text: "Universities", path: "/universities" },
    { icon: <FaChartBar />, text: "Doctors", path: "/doctors" },
    { icon: <FaEnvelope />, text: "Categories", path: "/categories" },
    { icon: <FaBook />, text: "Courses", path: "/courses" },
    { icon: <FaFileAlt />, text: "Exams", path: "/exams" },
    { icon: <FaVideo />, text: "Lectures", path: "/lectures" },
    { icon: <FaUserGraduate />, text: "Students", path: "/students" },
    { icon: <FaNewspaper />, text: "Articles", path: "/articles" },
    { icon: <FaDoorOpen />, text: "Rooms", path: "/rooms" },
    { icon: <FaComments />, text: "Chat", path: "/chat" },
    { icon: <FaBullhorn />, text: "Ads", path: "/ads" },
    { icon: <FaQrcode />, text: "Qr Code", path: "/qr-code" },
    { icon: <FaCog />, text: "Settings", path: "/settings" }
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-white text-black transition-all duration-300 z-20 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && <h1 className="text-xl font-bold">Menu</h1>}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="mt-6">
        {sidebarItems.map((item) => (
          <SidebarItem 
            key={item.path}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isOpen={isOpen}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
    </div>
  );
}

const SidebarItem = ({ icon, text, path, isOpen, isActive }) => (
  <NavLink
    to={path}
    className={`flex items-center p-4 mx-2 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-[#841A62] text-white' 
        : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <div className="text-xl">{icon}</div>
    {isOpen && <span className="ml-4">{text}</span>}
  </NavLink>
);