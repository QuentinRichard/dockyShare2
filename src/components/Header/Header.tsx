
export interface HeaderProps {
  isMenuOpen: boolean
  toggleMenu: unknown
}

export default function Header(/*props: HeaderProps*/) {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <a href="#" className="navbar-brand">MonSite</a>
        {/* <button onClick={props.toggleMenu} className="menu-toggle">
          <svg className="menu-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button> */}
        <div className={`navbar-menu`}> /
          {/* ${props.isMenuOpen ? 'active' : ''} */}
          <a href="/signin" className="navbar-link">signin</a>
          <a href="/signup" className="navbar-link">signup</a>
          <a href="/dashboard" className="navbar-link">Contact</a>
        </div>
      </div>
    </nav>
  );
}
