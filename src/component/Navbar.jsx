import { FaBars, FaSearch, FaGlobe } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


export default function Navbar() {

const getUserInfo = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    const name = decoded.Name;
    const id = decoded.Id;
    const role = decoded.Role;
    const image = decoded.Image;

    return { name, id, role, image };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const user = getUserInfo();


  return (
    <div className="w-full h-[60px] border border-gray-200 bg-white flex items-center px-4 shadow-md justify-between">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1">
        <FaBars className="text-2xl text-gray-800 cursor-pointer" />

        {/* Search bar */}
        <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-2 flex-grow max-w-lg">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* Right: Language, Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 cursor-pointer">
          <FaGlobe className="text-xl text-gray-800" />
          <span className="text-gray-800 font-medium hidden sm:inline">English</span>
          <MdArrowDropDown className="text-gray-600" />
        </div>

        <img
          src={`https://thirdpartyy.runasp.net${user?.image}`}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer object-cover"
        />
        <div className="hidden sm:flex flex-col">
          <span className="text-gray-800 font-semibold cursor-pointer">{user?.name}</span>
          <span className="text-gray-600 text-sm cursor-pointer">{user?.role}</span>
        </div>
      </div>
    </div>
  );
}
