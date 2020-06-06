import React from 'react';
import BasePage from '../BasePage/BasePage';
import Carousel from '../Utils/Carousel/Carousel';
import AreaAcesso from '../../AreaAcesso/AreaAcesso';

class Home extends BasePage {

    imgs = [
        'https://www.colorworldimaging.co.uk/wp-content/uploads/2018/06/s.jpg',
        'https://bbk12e1-cdn.myschoolcdn.com/ftpimages/90/news/large_news1157661_1116548.jpg',
        'https://www.bournemouthecho.co.uk/resources/images/9348617?type=responsive-gallery-fullscreen'
    ]

    constructor(props) {
        super(props);
        this.state = {
            carouselImgs: this.imgs
        }
    }

    renderPage() {
        return (
            <div className="container">
                <AreaAcesso />
                <hr />
                <div className="row">
                    <h5 className="center-align">Mostruario aqui</h5>
                </div>
                {/* <Mostruario /> */}
                <hr />
                <Carousel imgs={this.imgs} />
            </div>
        );
    }

}
export default Home;