import React, { Component } from 'react';
import M from "materialize-css";
import './CardActions.css';

class CardActions extends Component {

    componentDidMount() {
        const options = {
            direction: 'right',
            hoverEnabled: false
        }

        let fab = M.FloatingActionButton.init(this.Fab, options);
        fab.open();
        fab.close();
    }

    render() {
        return (
            <div ref={Fab => {
                    this.Fab = Fab;
                }}
                className="fab-wrapper"
            >
                <button className="left btn-floating halfway-fab waves-effect waves-light green">
                    <i className="large material-icons">menu</i>
                </button>
                <ul>
                    <li>
                        <button className="left-fab btn-floating halfway-fab waves-effect waves-light blue"
                            onClick={this.props.editar}
                        >
                            <i className="large material-icons">mode_edit</i>
                        </button>
                        <button className="left-fab btn-floating halfway-fab waves-effect waves-light red"
                            onClick={this.props.excluir}
                        >
                            <i className="material-icons">delete_forever</i>
                        </button>
                    </li>
                </ul>
        </div>
        )
    }

}
export default CardActions;
