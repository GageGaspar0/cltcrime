import './Header.css'
import qccrown from '../../assets/qccrown.png';

export default function Header() {

  return (
    <header className="app-header">
        <img src={qccrown} alt="Logo" className="header-logo"/>
    </header>
  );
} 