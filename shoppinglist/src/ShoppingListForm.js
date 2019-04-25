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
            },
            items: []
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

    componentDidMount() {
        this.addItem();
    }

    addItem() {
        console.log("### ADD ITEM ###");
        /*let shoppingListCopy = JSON.parse(JSON.stringify(this.state.shoppingList));

        shoppingListCopy.items.push("");

        this.setState({
            shoppingList: shoppingListCopy
        });*/

        this.setState({
            items: [...this.state.items, ""]
        });
    }

    handleItemChange(e, index){
        console.log(`index: ${index}`);
        console.log(`shoppingList.items.length - 1: ${(this.state.shoppingList.items.length-1)}`);
        console.log(`e.value: ${e.target.value}`);
        this.state.items[index] = e.target.value;
        /*if((this.state.shoppingList.items.length-1) <= index){
            this.addItem();
        }

        let shoppingListCopy = JSON.parse(JSON.stringify(this.state.shoppingList));

        shoppingListCopy.items[index] = e.target.value;*/



        //console.log(`shoppingListCopy: ${JSON.stringify(shoppingListCopy)}`);

        //set the state...
        this.setState({items: this.state.items});


        //console.log(`shoppingList: ${JSON.stringify(this.state.shoppingList)}`);

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
            if (currShoppingList.items.length <= itemID) {
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

        /*let x = 0;
        this.state.shoppingList.items.forEach((elm) => {
            itemsList.push(
                <input key={`title_${x}`} type="text" name={`item_${x}`} id="itemTitle" className="itemTitleInput" value={this.state.shoppingList.items[x].title}
                       placeholder="Item name"
                       onChange={this.onChange}/>
            );
            itemsList.push(
                <input key={`price_${x}`} type="text" name={`item_${x}`} id="itemPrice" className="itemPriceInput" value={this.state.shoppingList.items[x].title}
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
        );*/


        return (
            <form className="createListForm" method="post" action="#">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={shoppingList.title} onChange={this.onChange}/>
                {
                    this.state.items.map((item, index) => {
                        return (
                            <input className="itemTitleInput" key={index} type="text" value={item} onChange={(e)=>this.handleItemChange(e, index)} />
                        )
                    })
                }
                <button onClick={this.handleInput}
                        type="submit" id="submitItemBtn" className="btn btn-primary">CREATE
                </button>
            </form>
        );
    }
}

export default ShoppingListForm;
