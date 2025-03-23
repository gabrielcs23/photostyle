import React from "react";

const loadingWrapper = {
    width: '20px',
    height: '20px',
    marginRight: '1em',
    marginTop: '0.5em'
};

const LoadingBotao = () => (
    <div className="preloader-wrapper active" style={loadingWrapper}>
        <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
                <div className="circle" />
            </div>
            <div className="gap-patch">
                <div className="circle" />
            </div>
            <div className="circle-clipper right">
                <div className="circle" />
            </div>
        </div>
    </div>
)

export default LoadingBotao;
