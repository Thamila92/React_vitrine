import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './home.css';  // Si le fichier CSS est là

// Assurez-vous d'importer les images que vous voulez utiliser
import image1 from '../../assets/images/image_1.jpg';
import image2 from '../../assets/images//image_2.jpeg';
import image3 from '../../assets/images/image_3.jpg';
import image4 from '../../assets/images/image_4.jpg';

const Home = () => {
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
    <div className="home-container">
      {/* Slider Section */}
      <section className="hero-slider">
        <Slider {...settings}>
          <div className="slider-item">
            <img src={image1} alt="Slide 1" />
            <div className="slider-text">
              <h1>Bienvenue chez Companion</h1>
              <p>Votre partenaire pour un accompagnement de qualité.</p>
            </div>
          </div>
          <div className="slider-item">
            <img src={image2} alt="Slide 2" />
            <div className="slider-text">
              <h1>Des activités pour tous</h1>
              <p>Nous organisons des événements pour le bien-être des personnes âgées.</p>
            </div>
          </div>
          <div className="slider-item">
            <img src={image3} alt="Slide 3" />
            <div className="slider-text">
              <h1>Rejoignez-nous</h1>
              <p>Découvrez comment vous pouvez participer à nos activités.</p>
            </div>
          </div>
          <div className="slider-item">
            <img src={image4} alt="Slide 4" />
            <div className="slider-text">
              <h1>Contactez-nous</h1>
              <p>Nous sommes à votre écoute pour toute question.</p>
            </div>
          </div>
        </Slider>
      </section>

      {/* Section À propos */}
      <section id="about" className="about-section">
        <h2>Qui sommes-nous ?</h2>
        <p>
          Companion est une association dédiée à l'accompagnement des personnes âgées en France. Nous travaillons chaque jour pour améliorer leur qualité de vie grâce à des services d'assistance, des activités sociales et des événements communautaires. 
          Nous croyons fermement qu'ensemble, nous pouvons créer un environnement où les personnes âgées peuvent s'épanouir et vivre en toute dignité.
        </p>
      </section>

      {/* Section Nos événements */}
      <section id="events" className="events-section">
        <h2>Découvrez nos actions</h2>
        <p>
          Chez Companion, nous organisons régulièrement des activités et des événements qui reflètent nos valeurs fondamentales : le respect, l'empathie, et l'engagement envers les personnes âgées.
        </p>
      </section>

      {/* Section Nous trouver */}
      <section id="location" className="location-section">
        <h2>Nous trouver</h2>
        <p>Nos locaux se situent ici :</p>
        <div className="map-container">
          <iframe
            title="Companion Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999318774351!2d2.2944812156746975!3d48.85884417928738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fefece0b8a5%3A0x602b1b6f4c9f5e0a!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1614073193213!5m2!1sfr!2sfr"
            width="600"
            height="450"
            allowFullScreen={true}
            loading="lazy"
            style={{ border: "0" }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Companion. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
