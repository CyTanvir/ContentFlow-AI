import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";

const Layout = ({ children, onLogout}) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar onLogout={onLogout} />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
