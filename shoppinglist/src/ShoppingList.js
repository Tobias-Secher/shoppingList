import React, {Component} from 'react';

import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Link from "react-router-dom/es/Link";

class ShoppingList extends Component {

    render() {
        let list = [];
        this.props.shoppingLists.forEach((elm) => {
            let dotStyle = {
                backgroundColor: elm.dotColor
            };
            list.push(
                <Link key={elm._id} to={'/shoppingList/update/' + elm._id}>
                    <div className="shoppingItem" >
                        <span className="dot" style={dotStyle}>
                            <ShoppingCart className="shoppingCart" />
                        </span>
                        <div className="info">
                            <h2>{elm.title}</h2>
                            <span className="description">{elm.description}</span>
                        </div>
                        <ArrowRightIcon className="arrowRightIcon"/>
                    </div>
                </Link>
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