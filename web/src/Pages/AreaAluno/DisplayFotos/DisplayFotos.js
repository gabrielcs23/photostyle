import 'react-image-gallery/styles/scss/image-gallery.scss';
import React from 'react';
import ImageGallery from 'react-image-gallery';
import './DisplayFotos.scss'
const DisplayFotos = (props) => {

    const display = props.fotos.map(foto => (
        {
            original: foto.url,
            thumbnail: foto.url,
            description: foto.descricao,
        }
    ));

    return (
        <div className="container container-galeria">
            <ImageGallery
                items={display}
                showNav={false}
                showPlayButton={false}
                thumbnailPosition={"left"}
                showThumbnails
            />
        </div>
    );

}
export default DisplayFotos;