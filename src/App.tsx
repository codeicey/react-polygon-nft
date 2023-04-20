/* eslint-disable jsx-a11y/anchor-is-valid */
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from './pages';
import CreateItem from './pages/create-nft';
import MyAssets from './pages/my-nfts';
import CreatorDashboard from './pages/dashboard';
import styles from "./pages/css/navbar.module.css"


function App() {
  return (
    <BrowserRouter>
      <div className="App">

        <div>
          <nav className={styles.navbar}>
            <p className={`${styles.title} text-4xl font-bold`}>Polygon NFT Marketplace</p>
            <div className="flex mt-4">
              <Link to={'/'}>
                <a className={`mr-4 ${styles.link}`}>Home</a>
              </Link>
              <Link to={'/createnft'}>
                <a className={`mr-6 ${styles.link}`}>Sell NFT</a>
              </Link>
              <Link to={'/mynft'}>
                <a className={`mr-6 ${styles.link}`}>My NFTs</a>
              </Link>
              <Link to={'/dashboard'}>
                <a className={`mr-6 ${styles.link}`}>Dashboard</a>
              </Link>
            </div>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="createnft" element={<CreateItem />} />
          <Route path="mynft" element={<MyAssets />} />
          <Route path="dashboard" element={<CreatorDashboard />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
