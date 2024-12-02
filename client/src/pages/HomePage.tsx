import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/HomePage/Home';
import Footer from '../components/footer';

const HomePage: React.FC = () => {
    return (
        <div className="HomePage">
            <Navbar />
            <div className="mt-28">
                <Home ratings={[5, 5, 3]}/>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
