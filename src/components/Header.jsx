import { useNavigate } from 'react-router-dom' // Import useNavigate
const Header = () => {
  let navigate = useNavigate()

  const openMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          navigate('/form/');
        }
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/');
    }
  };
  
  return (
    <div className="header">
      <div className="logo_container">
        <img src="styles\images\ourlogo.png" alt="Our Logo" className="logo" />
      </div>
      <div className="box_header">
        <a href="">
          <div className="header_nav">
            <p className="nav_text">Marketplace</p>
          </div>
        </a>
        <a href="">
          <div className="header_nav">
            <p className="nav_text">Projects</p>
          </div>
        </a>
        <a href="">
          <div className="header_nav">
            <p className="nav_text">Discord</p>
          </div>
        </a>
        <a href="">
          <div className="header_nav">
            <p className="nav_text">About</p>
          </div>
        </a>
      </div>
      <div className="btn_nav" onClick={openMetaMask}>
        <p className="btn_text">✨ Create Now ✨</p>
      </div>
    </div>
  )
}

export default Header
