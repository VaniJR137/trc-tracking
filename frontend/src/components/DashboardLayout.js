import { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Wrench,
  User2,
  LogOut,
  ChevronRight,
  ChevronLeft,
  FormInput,
  UserPlus,
  FilePen,
  BarChart2,
  Users,
  Building2,
  MapPin,
} from "lucide-react";
import { userStore, sidebarStore } from "../store/userStore";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children, onMenuSelect }) => {
  const { open, toggleOpen } = sidebarStore();
  const { activeUser, clearUser } = userStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = {
    admin: [
      {
        label: "Requests",
        icon: <FilePen size={20} />,
        path: "/admin/adminrequests",
      },
      {
        label: "Enrollment",
        icon: <UserPlus size={20} />,
        path: "/admin/enrollment",
      },
      {
        label: "Venue",
        icon: <MapPin size={20} />,
        path: "/admin/venueAdding",
      },
      {
        label: "Reports",
        icon: <BarChart2 size={20} />,
        path: "/admin/Report",

        // children: [
        //   {
        //     label: "Monthly",
        //     icon: <BarChart2 size={18} />, // Chart icon
        //     href: "/admin/monthlyReport",
        //   },
        //   {
        //     label: "Technician",
        //     icon: <Users size={18} />, // People icon
        //     href: "/admin/technicReport",
        //   },
        //   {
        //     label: "Department",
        //     icon: <Building2 size={18} />, // Building/department icon
        //     href: "/admin/departmentReport",
        //   },
        // ],
      },
    ],
    technician: [
      {
        label: "Reports",
        icon: <FileText size={20} />,
        path: "/technician/techreport",
      },
    ],
    user: [
      {
        label: "Repair Request",
        icon: <FormInput size={20} />,
        path: "/user/repair",
      },
      {
        label: "History",
        icon: <FileText size={20} />,
        path: "/user/history",
      },
    ],
  };

  // Navigate to first menu item on base path
  useEffect(() => {
    if (!activeUser) return;

    const role = activeUser.role;
    const currentPath = location.pathname;
    const basePath = `/${role}`;

    if (currentPath === basePath) {
      const firstItem = menuItems[role]?.[0];
      if (firstItem?.path) {
        navigate(firstItem.path, { replace: true });
        onMenuSelect?.(firstItem.label); // only call if we're navigating
      } else if (firstItem?.children?.[0]?.href) {
        navigate(firstItem.children[0].href, { replace: true });
        onMenuSelect?.(firstItem.children[0].label);
      }
    }
  }, [activeUser]);
  
  
  

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  if (!activeUser) {
    navigate("/");
    return null;
  }

  const isChildActive = (child) => location.pathname === child.href;

  const isItemActive = (item) => {
    if (item.path) return location.pathname === item.path;
    if (item.children)
      return item.children.some((child) => location.pathname === child.href);
    return false;
  };
  
  

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 z-40  left-0 h-full p-4 bg-lightColor text-black transition-all duration-500 ease-in-out ${
          open ? "w-20" : "w-48   "
        }`}
      >
        <div className="flex justify-center items-center border-b border-darkColor pb-1">
          <p className="text-s text-darkColor capitalize">{activeUser.role}</p>
        </div>

        <div className="flex flex-col h-[26rem] justify-between items-center">
          <div className="mt-8 w-full">
            {(menuItems[activeUser.role] || []).map((item, idx) => (
              <div key={idx} className="relative w-full">
                <div
                  onClick={() => {
                    if (item.children) {
                      setOpenDropdown((prev) =>
                        prev === item.label ? null : item.label
                      );
                    } else {
                      setOpenDropdown(null);
                      navigate(item.path);
                      onMenuSelect?.(item.label);
                    }
                  }}
                  className={`flex items-center p-2 gap-4 mt-4 rounded cursor-pointer w-full ${
                    isItemActive(item)
                      ? "bg-blue-800 text-white"
                      : "text-darkColor hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  <div className="ml-1">{item.icon}</div>
                  {!open && <span className="text-[15px]">{item.label}</span>}
                  {item.children && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </div>

                {/* Dropdown */}
                {item.children &&
                  openDropdown === item.label &&
                  (open ? (
                    <div className="absolute -mt-16 ml-2 left-full w-12 bg-white shadow-md rounded-lg z-50">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        {item.children.map((child, cIdx) => (
                          <div
                            key={cIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (child.href) {
                                navigate(child.href);
                                onMenuSelect?.(child.label);
                              }
                            }}
                            className={`flex items-center justify-center w-10 py-2 rounded-lg transition cursor-pointer ${
                              isChildActive(child)
                                ? "bg-blue-800 text-white"
                                : "text-blue-800 hover:bg-gray-100"
                            }`}
                          >
                            <span className="w-5 h-5">{child.icon}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="ml-4 mr-6 mt-2 flex flex-col gap-1">
                      {item.children.map((child, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (child.href) {
                              navigate(child.href);
                              onMenuSelect?.(child.label);
                            }
                          }}
                          className={`flex items-center gap-2 px-2 py-1 rounded text-sm cursor-pointer transition ${
                            isChildActive(child)
                              ? "bg-gray-300 text-darkColor"
                              : "text-blue-800 hover:bg-gray-200"
                          }`}
                        >
                          <span className="w-5 h-5">{child.icon}</span>
                          <span>{child.label}</span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className={`flex items-center ${!open ? "-ml-12" : ""} gap-2`}>
            <button
              onClick={() => {
                clearUser();
                navigate("/");
              }}
              className="flex gap-4 text-sm hover:text-gray-200 text-darkColor hover:bg-blue-800 px-2 py-2 rounded"
            >
              <LogOut size={20} />
              {!open && <div className="text-[15px]">Logout</div>}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar */}
      <div
        className={`absolute transform  transition-all z-50  pointer-events-auto duration-500 ease-in-out ${
          open ? "top-16 left-16 " : "top-16 left-44 ml-2"
        } flex items-center justify-between`}
      >
        <button onClick={toggleOpen} className="border rounded-3xl bg-white">
          {!open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 ml-10">{children}</div>
    </div>
  );
};

export default DashboardLayout;
