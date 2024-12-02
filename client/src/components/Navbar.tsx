import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/authentificate/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
  
      const data = await response.json();
  
      if (data.role) {
        navigate('/admin');      
      } else {
        console.log('Non-admin login');
      }
  
      closeModal();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/authentificate/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: signupName,
          username: signupName,
          password: signupPassword,
          email: signupEmail,
          phone_number: signupPhone,
        }),
      });

      const data = await response.json();
      console.log('Signup successful:', data);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <>
      <nav className="navbar bg-pink-400 w-full fixed top-0 left-0 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50">
        {/* Left Section */}
        <div className="flex items-center xl:relative xl:left-32 pr-2">
          <img
            src={logo}
            alt="Pink Car Logo"
            className="w-24 h-10 sm:w-32 sm:h-12 md:w-40 md:h-14 object-contain"
          />
        </div>

        {/* Center Section */}
        <div className="hidden md:flex flex-1 justify-right lg:pl-8 xl:pl-48 space-x-6 text-white text-base leading-6 font-medium mx-2">
          <a href="#deplacez-vous" className="hover:underline flex items-center justify-center text-center">
            Déplacez-Vous Avec Pink Car
          </a>
          <a href="#conduire" className="hover:underline flex items-center justify-center text-center">
            Conduire
          </a>
          <a href="#louer" className="hover:underline flex items-center justify-center text-center">
            Louer
          </a>
          <a href="#apropos" className="hover:underline flex items-center justify-center text-center">
            À Propos
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex space-x-4 ml-auto xl:mr-32">
            <button
              onClick={openModal}
              className="bg-transparent text-white text-base leading-6 font-medium tracking-normal capitalize text-left hover:underline"
            >
              Connexion
            </button>
            <button
              onClick={openModal}
              className="bg-white text-pink-400 text-sm leading-5 font-medium tracking-normal capitalize text-center px-3 py-1 rounded-md opacity-100 hover:bg-pink-500 hover:text-white w-[106px] h-[32px] flex items-center justify-center"
            >
              S'inscrire
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:hidden absolute top-20 left-0 w-full bg-pink-400 z-10`}
        >
          <div className="flex flex-col items-center space-y-4 py-4 text-white text-base leading-6 font-medium tracking-normal capitalize text-left">
            <a href="#deplacez-vous" className="hover:underline">
              Déplacez-Vous Avec Pink Car
            </a>
            <a href="#conduire" className="hover:underline">
              Conduire
            </a>
            <a href="#louer" className="hover:underline">
              Louer
            </a>
            <a href="#apropos" className="hover:underline">
              À Propos
            </a>
            <button
              onClick={openModal}
              className="bg-transparent text-white text-base leading-6 font-medium tracking-normal capitalize text-left hover:underline"
            >
              Connexion
            </button>
            <button
              onClick={openModal}
              className="bg-white text-pink-400 text-sm leading-5 font-medium tracking-normal capitalize text-center px-3 py-1 rounded-md opacity-100 hover:bg-pink-500 hover:text-white w-[106px] h-[32px] flex items-center justify-center"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm relative">
            <span
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 cursor-pointer text-2xl"
            >
              &times;
            </span>
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => showTab('login')}
              >
                Connexion
              </button>
              <button
                className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => showTab('signup')}
              >
                S'inscrire
              </button>
            </div>
            <div className="tab-content mt-4">
              {activeTab === 'login' ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">Connexion</h2>
                  <form onSubmit={handleLogin}>
                    <label htmlFor="loginUsername" className="block mb-2">Username:</label>
                    <input
                      type="text"
                      id="loginUsername"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <label htmlFor="loginPassword" className="block mb-2">Password:</label>
                    <input
                      type="password"
                      id="loginPassword"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <button type="submit" className="bg-pink-400 text-white py-2 px-4 rounded">
                      Connexion
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">S'inscrire</h2>
                  <form onSubmit={handleSignup}>
                    <label htmlFor="signupName" className="block mb-2">Name:</label>
                    <input
                      type="text"
                      id="signupName"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <label htmlFor="signupEmail" className="block mb-2">Email:</label>
                    <input
                      type="email"
                      id="signupEmail"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <label htmlFor="signupPhone" className="block mb-2">Phone number:</label>
                    <input
                      type="phone"
                      id="signupPhone"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <label htmlFor="signupPassword" className="block mb-2">Password:</label>
                    <input
                      type="password"
                      id="signupPassword"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded mb-4"
                      required
                    />
                    <button type="submit" className="bg-pink-400 text-white py-2 px-4 rounded">
                      S'inscrire
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
