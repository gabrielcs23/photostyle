import React from 'react';
import { Parallax } from 'react-parallax';
import BasePage from '../BasePage/BasePage';
import Carousel from '../Utils/Carousel/Carousel';
import AreaAcesso from './AreaAcesso/AreaAcesso';

class Home extends BasePage {

    renderPage() {
        return (
            <>
                <Parallax bgImage={`${process.env.PUBLIC_URL}/assets/images/parallax/01.jpg`} strength={500}>
                    <div style={{ height: 500 }} />
                </Parallax>
                
                <AreaAcesso {...this.props} />

                <div
                    style={{margin: "3rem"}}
                >
                    <Carousel />
                </div>
            </>
        );
    }

}
export default Home;