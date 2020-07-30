import React from 'react';
import BasePage from '../BasePage/BasePage';
import Carousel from '../Utils/Carousel/Carousel';
import AreaAcesso from './AreaAcesso/AreaAcesso';
// import Parralax from '../Utils/Parallax/Parallax';

class Home extends BasePage {

    carouselImgs = [
        `${process.env.PUBLIC_URL}/assets/images/carousel/01.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/02.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/03.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/04.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/carousel/05.jpg`,
    ]

    renderPage() {
        return (
            <>
                {/* <Parralax /> */}
                <AreaAcesso />
                <hr />
                <div className="row">
                    <h5 className="center-align">Mostruario aqui</h5>
                </div>
                {/* <Mostruario /> */}
                <hr />
                <div className="container">
                    <Carousel imgs={this.carouselImgs} />
                </div>
            </>
        );
    }

}
export default Home;