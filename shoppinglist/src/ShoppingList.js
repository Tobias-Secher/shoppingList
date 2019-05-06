import React, {Component} from 'react';

import ShoppingCart from '@material-ui/icons/ShoppingCart';
import DeleteButton from '@material-ui/icons/Clear';

import Link from "react-router-dom/es/Link";

class ShoppingList extends Component {


    handleInputDelete(event, data){
        console.log("test" + " " + data)
        event.preventDefault();
        this.props.deleteShoppingList(
            data
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
                        <DeleteButton className="deletebutton" onClick={((e) => this.handleInputDelete(e, elm._id))} />

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