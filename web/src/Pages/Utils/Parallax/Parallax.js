import React, { Component } from 'react';
import M from 'materialize-css';

class Parralax extends Component {

    componentDidMount() {
        M.Parallax.init(this.Parralax);
    }

    render() {
        return (
            <>
                <div
                    ref={Parralax => {
                        this.Parralax = Parralax;
                    }} 
                    className="parallax-container"
                >
                    <div className="parallax">
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/images/parallax/01.jpg`}
                            alt=""
                        />
                    </div>
                </div>
            </>
        );
    }
}
export default Parralax;