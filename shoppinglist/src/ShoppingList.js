import React, {Component} from 'react';

import ShoppingCart from '@material-ui/icons/ShoppingCart';
import DeleteButton from '@material-ui/icons/Clear';

import Link from "react-router-dom/es/Link";

class ShoppingList extends Component {


    handleInputDelete(event, id){
        console.log(id)
        event.preventDefault();
        this.props.deleteShoppingList(
            id
        );
    }

    render() {
        let list = [];
        this.props.shoppingLists.forEach((elm) => {
            let dotStyle = {
                backgroundColor: elm.dotColor
            };
            list.push(
                    <div key={elm._id} className="shoppingItem" >
                        <Link  to={'/shoppingList/update/' + elm._id}>
                        <span className="dot" style={dotStyle}>
                            <ShoppingCart className="shoppingCart" />
                        </span>
                        <div className="info">
                            <h2>{elm.title}</h2>
                            <span className="description">{elm.description}</span>
                        </div>
                        {/*<ArrowRightIcon className="arrowRightIcon"/>*/}

                        </Link>
                        {/*<OpenList  className="launchlist"/>*/}
                        <DeleteButton className="deletebutton" onClick={((e) => {if (window.confirm('Are you sure you wish to delete this item?')){this.handleInputDelete(e, elm._id)}})} />
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