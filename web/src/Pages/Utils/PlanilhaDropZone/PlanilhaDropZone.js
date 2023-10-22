import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
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
    return '#a6a6a6';
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
    backgroundColor: '#dfdfdf',
    color: '#808080',
    outline: 'none',
    transition: 'border .24s ease-in-out'
}

const PlanilhaDropZone = (props) => {
    const [file, setFile] = useState()
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: '.xlsx,.xls',
        multiple: false,
        onDrop: acceptedFiles => onDrop(acceptedFiles)
    });

    const onDrop = (drop) => {
        drop.forEach(planilha => {
            setFile(planilha);
            props.onDrop(planilha);
        });
    }

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}
                style={{ ...dragzone, borderColor: getColor({ isDragActive, isDragAccept, isDragReject }) }}
            >
                <input {...getInputProps()} />
                <p>Arraste a planilha ou clique aqui</p>
            </div>
            <aside style={thumbsContainer}>
                {file
                    ? (
                        <li key={file.path}>
                            {file.path} - {file.size} bytes
                        </li>
                    ) : null
                }

            </aside>
        </section>
    );
}
export default PlanilhaDropZone;
