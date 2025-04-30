// SlideShow.jsx
import React from 'react';

const Slideshow = () => {
  return (
    <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/images/post-large-image1.jpg" className="d-block w-100" alt="Slide 1" style={{ height: '600px', objectFit: 'cover' }} />
        </div>
        <div className="carousel-item">
          <img src="/images/post-large-image2.jpg" className="d-block w-100" alt="Slide 2" style={{ height: '600px', objectFit: 'cover' }} />
        </div>
        <div className="carousel-item">
          <img src="/images/post-large-image3.jpg" className="d-block w-100" alt="Slide 3" style={{ height: '600px', objectFit: 'cover' }} />
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slideshow;
