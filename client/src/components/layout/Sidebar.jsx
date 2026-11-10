import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useConfirm from "../../hooks/useConfirm";
import useToast from "../../hooks/useToast";
import BrandLogo from "../common/BrandLogo";
import {
  Megaphone,
  LayoutDashboard,
  Map,
  MessageCircle,
  PackageSearch,
  Shield,
  Users,
  UserCircle,
  X,
} from "lucide-react";

const studentLinks = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/community", "Community", Users],
  ["/lost-found", "Lost & Found", PackageSearch],
  ["/announcements", "Announcements", Megaphone],
  ["/campus-map", "Campus Map", Map],
  ["/assistant", "AI Assistant", MessageCircle],
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const accepted = await confirm({
      title: "Log out of S.H.I.E.L.D.?",
      description:
        "Your current session will be signed out.",
      confirmText: "Log out",
      variant: "warning",
      onConfirm: async () => {
        await logout();
      },
    });
    if (accepted) {
      onClose();
      toast.success("You have been logged out.");
      navigate("/login", { replace: true });
    }
  };
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <BrandLogo />
        <button className="icon-button mobile-menu" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="sidebar-section">Student space</div>
      <nav className="sidebar-nav">
        {studentLinks.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-section">Account</div>
      <nav className="sidebar-nav">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
          onClick={onClose}
        >
          <UserCircle size={18} />
          Profile
        </NavLink>
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <Shield size={18} />
            Admin demo
          </NavLink>
        )}
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <Shield size={18} />
          Log out
        </button>
      </nav>
    </aside>
  );
}
