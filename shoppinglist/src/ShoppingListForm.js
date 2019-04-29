import React, {Component} from 'react';

class ShoppingListForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            type: "",
            description: "",
            items: []
        };

        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.addItem();
    }

    addItem() {
        this.setState({items: [...this.state.items, {title: "", price: 0}]})
    }

    handleItemTitleChange(e, index) {
        /*console.log(`index: ${index}`);
        console.log(`shoppingList.items.length - 1: ${(this.state.items.length)}`);
        console.log(`e.value: ${e.target.value}`);*/
        this.state.items[index].title = e.target.value;
        //set the state...
        this.setState({items: this.state.items});
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }

        console.log(`shoppingList: ${JSON.stringify(this.state.items)}`);

    }

    handleItemPriceChange(e, index){
        /*console.log(`index: ${index}`);
        console.log(`shoppingList.items.length - 1: ${(this.state.items.length)}`);
        console.log(`e.value: ${e.target.value}`);*/
        this.state.items[index].price = e.target.value;
        //set the state...
        this.setState({items: this.state.items});
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }

        console.log(`shoppingList: ${JSON.stringify(this.state.items)}`);
    }

    handleInput(event) {
        event.preventDefault();

        let shoppingList = {
            title: this.state.title,
            items: this.state.items,
            type: "normal",
            description: ""
        }

        this.props.addShoppingList(shoppingList);
    }

    onChange(event) {
        let id = event.target.id;
        let value = event.target.value;

        if (id === "title") {
            this.setState({
                title: value
            })
        }
    }

    render() {
        return (
            <form className="createListForm" method="post" action="#">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" className="itemTitleInput" value={this.state.title} onChange={this.onChange} placeholder="Inkøbsliste titel"/>
                <label>Items</label>
                {
                    this.state.items.map((item, index) => {
                        return (
                            <div key={index} className="items">
                                <input className="itemTitleInput" key={`itemTitle_${index}`} type="text"
                                       value={item.title}
                                       onChange={(e) => this.handleItemTitleChange(e, index)} placeholder="Title"/>
                                <input className="itemPriceInput" key={`itemPrice_${index}`} type="text"
                                       value={item.price} onChange={(e) => this.handleItemPriceChange(e, index)}
                                       placeholder="Price"/>
                            </div>
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
