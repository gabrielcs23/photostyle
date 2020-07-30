import React, { Component } from 'react';
import M from "materialize-css";

class Carousel extends Component {

    carouselItemStyle = {
        maxWidth: "100%",
        height:"100%",
        width: "auto"
    }

    constructor(props) {
        super(props);
        this.state = {
            imgs: props.imgs
        }
    }

    componentDidMount() {
        const options = {
            duration: 200,
            indicators: true,
        }

        M.Carousel.init(this.Carousel, options);
    }

    renderCarouselItems() {
        return this.state.imgs.map((img, idx) => {
            return (
                <span key={idx} className="carousel-item center-align">
                    <img
                        src={img}
                        alt={`carousel${idx}`}
                        style={this.carouselItemStyle}
                    />
                </span>
            );
        });
    }

    render() {
        return (
            <div 
                ref={Carousel => {
                    this.Carousel = Carousel;
                }}
                className="carousel carousel-slider"
            >
                {this.renderCarouselItems()}
            </div>
        );
    }

}
export default Carousel;