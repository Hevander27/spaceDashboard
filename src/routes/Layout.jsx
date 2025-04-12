import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <h1 className="sidebar-title">Space Explorer</h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <span className="icon">🏠</span> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/about">
                <span className="icon">ℹ️</span> About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;