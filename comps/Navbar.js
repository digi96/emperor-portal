import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Emperor
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/listings">
                <a className="nav-link" href="#">
                  Listings
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/member">
                <a className="nav-link" href="#">
                  Member
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled">Disabled</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
