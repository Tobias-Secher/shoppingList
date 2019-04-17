import React, {Component} from 'react';

class ShoppingListForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            shoppingList: ""
        };

        fetch('http://localhost:8080/api/shoppingLists/' + props.match.params.id)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    shoppingList: json
                });
            }).catch(error => {
            console.log(error);
        });

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
        //let name = event.target.name;

        let currShoppingList = this.state.shoppingList;
        console.log(currShoppingList);


        if (id === "title") {
            currShoppingList.title = value;
            this.setState({
                shoppingList: currShoppingList
            })
        } else if (id === "item") {
            this.setState({
                shoppingList: this.state.shoppingList.items[0]
            });
        }
    }

    render() {
        let shoppingList = this.state.shoppingList;
        let itemsList = [];

        if (shoppingList.items) {
            let x = 0;
            shoppingList.items.forEach((elm) => {
                itemsList.push(
                    <input key={x} type="text" name={`item${x}`} id="item" className="itemInput" value={elm.title} placeholder="Item name"
                           onChange={this.onChange}/>
                );
                x++;
            });

        } else {
            itemsList.push(
                <input key={"item0"} type="text" name="item0" id="item" className="itemInput" placeholder="Item name"
                       onChange={this.onChange}/>
            )
        }

        return <form method="post" action="#">
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
