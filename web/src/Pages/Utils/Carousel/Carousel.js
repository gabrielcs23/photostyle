import '@brainhubeu/react-carousel/lib/style.css';
import React from 'react';
import ReactCarousel from '@brainhubeu/react-carousel';

const Carousel = () => {

    const imgs = [
        `${process.env.PUBLIC_URL}/assets/images/carousel/01.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/02.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/03.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/04.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/05.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/06.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/07.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/08.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/09.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/10.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/11.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/12.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/13.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/14.jpg`,
    ];

    const slides = imgs.map((img, idx) => {
        return (
            <img
                src={img}
                alt={`carousel${idx}`}
                key={`carousel${idx}`}
            />
        )
    });

    return (
        <ReactCarousel
            centered
            infinite
            slides={slides}
            autoPlay={4000}
            slidesPerPage={3}
        >
        </ReactCarousel>
    );

}
export default Carousel;