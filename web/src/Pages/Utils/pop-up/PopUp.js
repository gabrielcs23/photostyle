import M from 'materialize-css';

const status = {
    SUCCESS: 'green',
    ERROR: 'red',
    WARNING: 'yellow'
}

const PopUp = {

    sucesso: (msg) => {
        M.toast({html: msg, classes: status.SUCCESS, displayLength: 15000})
    },

    erro: (msg) => {
        M.toast({html: msg, classes: status.ERROR, displayLength: 15000})
    },

    aviso: (msg) => {
        M.toast({html: msg, classes: status.WARNING, displayLength: 15000})
    },

}

export default PopUp;