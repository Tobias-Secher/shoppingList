import React, {Component} from 'react';

class ShoppingList extends Component {
    render() {
        let list = [];
        this.props.items.forEach((elm) => {
            list.push(
                <div className="shoppingItem" key={elm.id}>
                    <span className="dot"/>
                    <div className="info">
                        <h2>{elm.title}</h2>
                        <span className="description">{elm.description}</span>
                    </div>
                    <i className="material-icons">
                        keyboard_arrow_right
                    </i>
                </div>
            )
        });

        return (
            <div>
                {list}
            </div>
        )
    }
}

export default ShoppingList;