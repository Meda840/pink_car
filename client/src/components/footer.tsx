// src/components/Footer.tsx
import React from 'react';
// Assuming the logo image is imported as a React component
import logo from '../assets/footer/footer-logo.png'; // Update the path based on your project structure
import appStore from '../assets/footer/app-store.png'; // Update the path
import googlePlay from '../assets/footer/play-store.png'; // Update the path

const Footer: React.FC = () => {
  return (
    <footer className="bg-pink-400 text-white">
        <div className="w-full flex flex-col lg:flex-row justify-between text-center items-center lg:items-start pt-24 pb-8 pr-4">
            {/* Logo */}
            <div className="flex justify-center items-center lg:w-1/4 mb-8 lg:mb-0 lg:pl-24 pt-5">
                <img src={logo} alt="Pink Car Logo" />
            </div>

            {/* Links */}
            <div className="flex flex-col lg:flex-row text-center lg:text-left mb-20 lg:mb-0 lg:w-3/4">
                {/* Column 1 */}
                <div className="lg:w-1/4 lg:ml-24 lg:pr-8 mb-12">
                    <h4 className="font-rubik font-medium text-[26px] leading-[31px] mb-4">ENTREPRISE</h4>
                    <ul>
                        <li className="mb-4"><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px]">À Propos</a></li>
                        <li><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px] mb-4">Nos Services</a></li>
                    </ul>
                </div>
                {/* Column 2 */}
                <div className="lg:w-1/4 mb-12 lg:pr-8 xl:pr-36">
                    <h4 className="font-rubik font-medium text-[26px] leading-[31px] mb-4">PRODUCTS</h4>
                    <ul className="">
                        <li className="mb-4"><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px]">Déplacez-Vous Avec Pink Car</a></li>
                        <li className="mb-4"><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px]">Conduire</a></li>
                        <li><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px] mb-4">Louer</a></li>
                    </ul>
                </div>
                {/* Column 3 */}
                <div className="lg:w-2/4">
                    <h4 className="font-rubik font-medium text-[26px] leading-[31px] mb-4">SÉCURITÉ</h4>
                    <ul className="mb-8">
                        <li><a href="#" className="hover:underline font-rubik font-medium text-[21px] leading-[25px]">Accédez Au Centre D'aide</a></li>
                    </ul>
                    <h4 className="font-rubik font-medium text-[26px] leading-[31px] mb-4">TÉLÉCHARGEZ NOTRE APPLICATION</h4>
                    <div className="flex justify-center lg:justify-start">
                        <a href="#" className="">
                            <img src={googlePlay} alt="App Store" className="" />
                        </a>
                        <a href="#">
                            <img src={appStore} alt="Google Play" className="" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
        {/* Footer Bottom */}
        <div className="container mx-auto text-center pb-8">
            <p className="font-mervat font-normal text-[18px] leading-[22px]">&copy; 2024 PINK CAR</p>
        </div>
    </footer>
  );
};

export default Footer;
