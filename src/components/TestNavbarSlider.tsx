import React from 'react';
 import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from './navbar/Navbar';

const TestNavbarSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

  return (
    <div>
      <Navbar />
      <h1>Test de la Navbar et du Slider</h1>
      <Slider {...settings}>
        <div>
          <img src="/images/image_1.jpg" alt="Slider 1" />
          <p>Slide 1</p>
        </div>
        <div>
          <img src="/images/image_2.jpeg" alt="Slider 2" />
          <p>Slide 2</p>
        </div>
      </Slider>
    </div>
  );
};

export default TestNavbarSlider;
