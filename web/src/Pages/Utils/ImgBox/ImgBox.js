import React, { useEffect } from 'react';
import M from 'materialize-css';

const ImgBox = (props) => {

    let imgRef;

    const box = (
        <img
            ref={imgBox =>{
                imgRef = imgBox
            }}
            className="materialboxed responsive-img"
            src={props.img}
            alt={props.alt}
        />
    )

    useEffect(() => {
        M.Materialbox.init(imgRef);
    }, [imgRef])

    return box;

}
export default ImgBox;