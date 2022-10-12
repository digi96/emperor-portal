import Footer from './Footer';
import Navbar from './Navbar';
import Providers from '../providers/Providers.comp';

const Layout = ({ children }) => {
  return (
    <Providers>
      <div className="content">
        <Navbar />
        <br></br>
        <br></br>
        <br></br>
        {children}
        <Footer />
        <br></br>
      </div>
    </Providers>
  );
};

export default Layout;
