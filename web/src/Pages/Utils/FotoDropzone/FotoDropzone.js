import React, {useEffect, useState, useRef, Fragment} from 'react';
import {useDropzone} from 'react-dropzone';
import ModalConfirmarExclusao from '../Modal/Modal'

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
    position: 'initial',
    cursor: 'pointer'
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
    const [files, setFiles] = useState(props.fotos ? props.fotos : []); // hook para estado
    const didMountRef = useRef(false); // hook para guardar se componente foi montado ou atualizado
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: 'image/*',
        multiple: props.multiple,
        onDrop: acceptedFiles => onDrop(acceptedFiles)
    });

    const onDrop = (drop) => {
        if (props.multiple) {
            return onDropMultiple(drop);
        } else {
            return onDropSingle(drop);
        }
    }

    const onDropSingle = (drop) => {
        drop.forEach(foto => {
            Object.assign(foto, {url: URL.createObjectURL(foto)});
            setFiles([foto]);
            props.onFotoDrop(foto);
        });
    }
    
    const onDropMultiple = (fotos) => {
        const newFiles = files.slice();
        fotos.forEach(file => {
            Object.assign(file, {url: URL.createObjectURL(file)});
            newFiles.push(file);
            props.onFotoDrop(file);
        });
        setFiles(newFiles);
    }

    const removerFoto = (idx) => {
        if (props.multiple) {
            props.removerFoto(idx);
            const newFiles = files.slice();
            newFiles.splice(idx, 1);
            setFiles(newFiles);
        } else {
            props.removerFoto();
            setFiles([]);
        }
    }

    const getBotaoExcluir = (id, idx) => {
        if (id) {
            return (
                <button className={'btn-floating halfway-fab waves-effect waves-light red modal-trigger'}
                        style={{zIndex: 1000}}
                        data-target={id}
                    >
                    <i className="material-icons">delete_forever</i>
                </button>
            )
        } else {
            return (
                <button className={'btn-floating halfway-fab waves-effect waves-light red'}
                        style={{zIndex: 1000}}
                        onClick={() => removerFoto(idx)}
                    >
                    <i className="material-icons">delete_forever</i>
                </button>
            )
        }
    }
  
    const thumbs = files.map((file, idx) => {
        const idModal = `modal-confirmar-exclusao-${file.id}`;
        return (
            <Fragment key={file.name+file.url}>
                <ModalConfirmarExclusao
                    idModal={idModal}
                    titulo={'Excluir foto?'}
                    mensagem={(
                        <div>
                            <p>Tem certeza de que deseja excluir esta foto?</p>
                        </div>
                    )}
                    confirmar={() => removerFoto(idx)}
                />
                <div className="card" style={thumb}>
                    <div className="card-image" style={thumbInner} onClick={() => window.open(file.url)}>
                        <img
                            src={file.url}
                            style={img}
                            alt=''
                        />
                    </div>
                    {getBotaoExcluir(file.id ? idModal : null, idx)}
                </div>
            </Fragment>
        )
    });

    // hook capaz de agregar componentDidMount, componentDidUpdate e componentWillUnmount
    useEffect(() => {
        if (didMountRef.current) { // componentDidUpdate?
            // componente pai carregou fotos por http?
            if (files.length === 0 && props.fotos?.length > 0) {
                props.fotos
                    .filter(foto => !foto.url)
                    .map(foto => Object.assign(foto, {url: URL.createObjectURL(foto.formData.get('file'))}));
                setFiles(props.fotos);
            }
        } else { // componentDidMount?
            didMountRef.current = true;
        }
        return () => { // retorno representa componentWillUnmount
            files.forEach(file => {
                if (file.id == null) {
                    URL.revokeObjectURL(file.url); // evita memory leak com imagens não enviadas
                }
            });
        }
    }, [props,files]);

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