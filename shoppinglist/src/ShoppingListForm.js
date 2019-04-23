import React, {Component} from 'react';

class ShoppingListForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            shoppingList: {
                title: "",
                type: "",
                description: "",
                items: []
            }
        };

        if (props.match.params.id) {
            fetch('http://localhost:8080/api/shoppingLists/' + props.match.params.id)
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        shoppingList: json
                    });
                }).catch(error => {
                console.log(error);
            });
        }

        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleInput(event) {
        event.preventDefault();

        /*let shoppingList = {
            title: this.state.title,
            items: this.state.items.split(',')
        }

        this.props.addShoppingList(shoppingList);*/
    }

    onChange(event) {
        let id = event.target.id;
        let value = event.target.value;
        let name = event.target.name;
        let itemID = name.substr(5, name.length);

        let currShoppingList = this.state.shoppingList;

        if (id === "title") {
            currShoppingList.title = value;
            this.setState({
                shoppingList: currShoppingList
            })
        } else if (id === "itemTitle") {
            //console.log(itemID);
            //console.log(currShoppingList.items.length);
            if (currShoppingList.items.length <= itemID) {
                let newItem = {
                    title: value,
                    price: ""
                };
                currShoppingList.items.push(newItem);
            } else {
                currShoppingList.items[itemID].title = value;
            }
            this.setState({
                shoppingList: currShoppingList
            });
        } else if (id === "itemPrice") {
            console.log("PRICE: " + value);
            if(currShoppingList.items.length <= itemID){
                let newItem = {
                    title: "",
                    price: value
                };
                currShoppingList.items.push(newItem);
            } else {
                currShoppingList.items[itemID].price = value;
            }
            this.setState({
                shoppingList: currShoppingList
            });
        }

        console.log(currShoppingList);

    }

    render() {
        let shoppingList = this.state.shoppingList;
        let itemsList = [];

        let x = 0;
        shoppingList.items.forEach((elm) => {
            itemsList.push(
                <input key={`title_${x}`} type="text" name={`item_${x}`} id="itemTitle" className="itemTitleInput" value={elm.title}
                       placeholder="Item name"
                       onChange={this.onChange}/>
            );
            itemsList.push(
                <input key={`price_${x}`} type="text" name={`item_${x}`} id="itemPrice" className="itemPriceInput" value={elm.price}
                       placeholder="Price"
                       onChange={this.onChange}/>
            );
            x++;
        });

        itemsList.push(
            <input key={`title_${x}`} type="text" name={`item_${x}`} id="itemTitle" className="itemTitleInput" placeholder="Item name"
                   onChange={this.onChange}/>
        );

        itemsList.push(
            <input key={`price_${x}`} type="text" name={`item_${x}`} id="itemPrice" className="itemPriceInput" placeholder="Price"
                   onChange={this.onChange}/>
        );


        return <form className="createListForm" method="post" action="#">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" value={shoppingList.title} onChange={this.onChange}/>
            {itemsList}
            <button onClick={this.handleInput}
                    type="submit" id="submitItemBtn" className="btn btn-primary">CREATE
            </button>
        </form>;
    }
}

export default ShoppingListForm;
