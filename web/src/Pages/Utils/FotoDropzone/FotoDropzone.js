import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
    cursor: 'unset'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
    zIndex: 1,
    position: 'initial'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const dragzone = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    cursor: 'pointer',
    borderWidth: 2,
    borderRadius: 2,
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
}

const FotoDropzone = (props) => {
    const [files, setFiles] = useState(props.fotos);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            const newFiles = files.slice();
            acceptedFiles.forEach(file => {
                props.onFotoDrop(file);
                Object.assign(file, {preview: URL.createObjectURL(file)});
                newFiles.push(file);
            });
            setFiles(newFiles);
        }
    });

    const removerFoto = (e, idx) => {
        e.preventDefault();
        props.removerFoto(idx);
    }
  
    const thumbs = files.map((file, idx) => (
        <div className="card" style={thumb} key={file.name+file.preview}>
            <div className="card-image" style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt=''
                />
                <button className="btn-floating halfway-fab waves-effect waves-light red"
                    style={{zIndex: 1000}}
                    onClick={e => removerFoto(e, idx)}
                >
                    <i className="material-icons">delete_forever</i>
                </button>
            </div>
        </div>
        )
    );

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({className: 'dropzone'})}
                style={{...dragzone, borderColor: getColor({isDragActive, isDragAccept, isDragReject})}}
            >
                <input {...getInputProps()} />
                <p>Arraste as fotos ou clique aqui</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}
export default FotoDropzone;