import React from 'react';
import Maps from './Maps';
import homePageImg from '../../assets/HomePage/Pink_Car.png';
import femaleImg from '../../assets/HomePage/Female.png';
import rightFlamingoCarImg from '../../assets/HomePage/cars_flamingo_right.png';
import leftFlamingoCarImg from '../../assets/HomePage/cars_flamingo_left.png';
import OneStar from '../../assets/HomePage/star.png';
import NoStar from '../../assets/HomePage/no_star.png';

interface ReviewCardProps {
  ratings: number[];
}

const HomePage: React.FC<ReviewCardProps> = ({ ratings }) => {

  const renderStars = (rating: number) => {
    const safeRating = Math.min(Math.max(rating, 0), 5);
    const stars = [...Array(safeRating)];
    const emptyStars = [...Array(5 - safeRating)];

    return (
      <div className="flex space-x-1">
        {/* Display filled stars */}
        {stars.map((_, i) => (
          <img key={`filled-${i}`} src={OneStar} alt="Star" />
        ))}
        {/* Display empty stars */}
        {emptyStars.map((_, i) => (
          <img key={`empty-${i}`} src={NoStar} alt="No Star" />
        ))}
      </div>
    );
  };

  return (
    <div className="HomePage">
      {/* First row - trip */}
      <div className="row1 flex flex-col-reverse lg:flex-row items-center justify-center p-4 lg:p-8 mb-20 mt-20">
        {/* Map and Input Section */}
        <Maps />

        {/* Second Element: on the right half of the screen */}
        <div className="w-full max-w-[830px] lg:w-1/2 xl:ml-12 lg:ml-4 mb-12">
          <div className="text-center font-oceanwide font-semibold text-costumGray text-[50px] leading-[60px] sm:text-[68px] sm:leading-[80px] md:text-[78px] md:leading-[90px] lg:text-[48px] lg:leading-[58px] xl:text-[80px] xl:leading-[95px] mb-8 lg:mt-20">
            Allez n'importe où avec <span className="text-pink-400">Pink Car</span>
          </div>

          <div className="bg-transparent bg-no-repeat bg-center">
            <img src={homePageImg} alt="Home Page" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Second Row - Presentation */}
      <div className="row2 flex flex-col xl:flex-row items-center justify-center p-6 mb-20 xl:pl-36 xl:pr-36 xl:ml-18">
        <div className="w-full max-w-[603px] h-auto max-h-[454px] xl:w-1/2 h-auto rounded-[33px]">
          <img src={femaleImg} alt="Maps" className="w-full h-full object-cover" />
        </div>
        <div className="xl:max-w-[708px] w-full xl:w-1/2 sm:pl-6 sm:pr-6 md:pl-20 md:pr-24 lg:pl-32 lg:pr-32 xl:pl-0 xl:pr-0 xl:ml-20">
          <div className="font-oceanwide font-semibold text-costumGray text-[32px] leading-[34px] sm:text-[38px] sm:leading-[41px] md:text-[46px] md:leading-[50px] lg:text-[46px] lg:leading-[50px] xl:text-[49px] xl:leading-[54px] mt-8 sm:mt-10 md:mt-12 mb-5">
            <span className="text-pink-400">Pink Car</span>, Pour une Mobilité en Toute Confiance
          </div>
          <div className="text-lightGray font-oceanwide font-semibold text-[16px] leading-[23px] sm:text-[18px] sm:leading-[26px] md:text-[22px] md:leading-[31px] lg:text-[22px] lg:leading-[31px] xl:text-[25px] xl:leading-[36px] mb-8">
            Bienvenue chez Pink Car, le service de covoiturage avec des conductrices. Notre mission est de fournir un transport sûr, fiable et confortable, permettant à tous de voyager en toute confiance. Que vous vous rendiez au travail, sortiez entre amis ou fassiez des courses, Pink Car est là pour garantir un trajet fluide et sécurisé. Rejoignez-nous pour redéfinir la mobilité, un trajet à la fois.
          </div>
        </div>
      </div>

       {/* Third Row - Customer Testimonials */}
       <div className="row3 w-full flex flex-col lg:flex-row items-center justify-center gap-1 bg-pink-100 py-16 px-24 mb-16 space-y-4 lg:space-y-0 lg:space-x-4">
        
        {/* First */}
        <div className="lg:w-1/3 bg-white p-4 rounded-[17px] shadow-md w-full h-full">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex flex items-center justify-center bg-white mr-2">
              
            </div>
            <div className="">
              <h3 className="font-montserrat font-bold text-[20px] leading-[24px] text-lightGray">Username</h3>
              <div className="flex items-center">
                <span className="font-montserrat font-medium text-lightGray text-[12px] leading-[15px] mr-1">{ratings[0]}.0</span>
                <div className="w-3">
                  {renderStars(ratings[0])}
                </div>
              </div>
            </div>
          </div>
          <p className="font-montserrat text-lightGray text-[11px] leading-[14px] p-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          </p>
        </div>
        
        {/* Second */}
        <div className="lg:w-1/3 bg-white p-4 md:p-5 rounded-[17px] shadow-md w-full h-full">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white mr-2 md:mr-3">
              
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-[20px] leading-[24px] md:text-[26px] md:leading-[32px] text-lightGray">Username</h3>
              <div className="flex items-center">
                <span className="font-montserrat font-medium text-lightGray text-[12px] leading-[15px] md:text-[17px] md:leading-[20px] mr-1">{ratings[1]}.0</span>
                <div className="w-3 sm:w-4">
                  {renderStars(ratings[1])}
                </div>
              </div>
            </div>
          </div>
          <p className="font-montserrat text-lightGray text-[11px] leading-[14px] md:text-[16px] md:leading-[19px] p-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          </p>
        </div>
        
        {/* Third */}
        <div className="lg:w-1/3 bg-white p-4 rounded-[17px] shadow-md w-full h-full">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex flex items-center justify-center bg-white mr-2">
              
            </div>
            <div className="">
              <h3 className="font-montserrat font-bold text-[20px] leading-[24px] text-lightGray">Username</h3>
              <div className="flex items-center">
                <span className="font-montserrat font-medium text-lightGray text-[12px] leading-[15px] mr-1">{ratings[2]}.0</span>
                <div className="w-3">
                  {renderStars(ratings[2])}
                </div>
              </div>
            </div>
          </div>
          <p className="font-montserrat text-lightGray text-[11px] leading-[14px] p-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          </p>
        </div>
      </div>

      {/* Fourth Row - Join Us Section */}
      <div className="row4 w-full bg-white flex flex-col items-center justify-center relative">
        <div className="relative w-full flex justify-center items-center">
          {/* Left Flamingo Car Image (Hidden on small screens) */}
          <img
            src={leftFlamingoCarImg}
            alt="Error Loading Image"
            className="hidden absolute md:block md:w-1/2 md:max-w-[400px] lg:w-1/3 xl:w-1/4 left-0 lg:pl-24 pl-4 lg:pr-0 pr-4"
          />
          <div className="w-full relative z-10 xl:w-1/2 flex flex-col items-center lg:justify-start text-center mb-20 p-4">
            <p className="text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-rubik font-medium text-lightGray mb-6 bg-white bg-opacity-40 rounded-md">
            Conduisez votre propre voiture ou louez-en une chez nous. Rejoignez notre communauté de femmes chauffeurs et profitez des avantages de Pink Car.
            </p>
            <div className="flex space-x-2 sm:space-x-4 w-full md:px-16 lg:px-40 xl:px-24">
              <button className="w-full w-1/2 box-border bg-pink-400 text-[17px] leading-[22px] sm:text-[21px] sm:leading-[25px] text-white font-rubik font-medium px-1 sm:px-10 py-3 rounded-md">
                CONDUISEZ AVEC NOUS
              </button>
              <button className="w-full w-1/2 box-border bg-pink-400 text-[17px] leading-[22px] sm:text-[21px] sm:leading-[25px] text-white font-rubik font-medium px-1 sm:px-10 py-3 rounded-md">
                LOUEZ POUR CONDUIRE
              </button>
            </div>
          </div>
          {/* Right Flamingo Car Image (Hidden on small screens) */}
          <img
            src={rightFlamingoCarImg}
            alt="Error Loading Image"
            className="hidden absolute md:block md:w-1/2 md:max-w-[400px] lg:w-1/3 xl:w-1/4 right-0 pr-4 lg:pr-20 pl-4 lg:pl-0"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
