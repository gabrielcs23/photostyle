import M from 'materialize-css';

const status = {
    SUCCESS: 'green',
    ERROR: 'red',
    WARNING: 'yellow darken-2'
}

const PopUp = {

    sucesso: (msg) => {
        M.toast({html: msg, classes: status.SUCCESS, displayLength: 5000})
    },

    erro: (msg) => {
        M.toast({html: msg, classes: status.ERROR, displayLength: 7000})
    },

    aviso: (msg) => {
        M.toast({html: msg, classes: status.WARNING, displayLength: 7000})
    },

}

export default PopUp;