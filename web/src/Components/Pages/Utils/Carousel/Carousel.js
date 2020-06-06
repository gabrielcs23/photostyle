import React, { Component } from 'react';
import M from "materialize-css";

class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs: props.imgs
        }
    }

    componentDidMount() {
        const options = {
            duration: 200,
        }

        M.Carousel.init(this.Carousel, options);
    }

    renderCarouselItems() {
        return this.state.imgs.map((img, idx) => {
            return (
                <span className="carousel-item">
                    <img src={img} alt={`carousel${idx}`} />
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
                className="carousel"
            >
                {this.renderCarouselItems()}
            </div>
        );
    }

}
export default Carousel;