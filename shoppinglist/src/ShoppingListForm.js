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
        this.setState({items: [...this.state.items, {title: "", price: ""}]})
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

    handleItemPriceChange(e, index) {
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
            description: "En kort beskrivelse af listen"
        };

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
                {/*<label htmlFor="title">Title</label>*/}
                <input type="text" name="title" id="title" className="titleInput" value={this.state.title}
                       onChange={this.onChange} placeholder="Inkøbsliste titel"/>
                {/*<label>Items</label>*/}
                <div className="items">
                    {
                        this.state.items.map((item, index) => {
                            let indexTxt = index;
                            if (indexTxt <= 9) {
                                indexTxt = 0 + "" + index;
                            }
                            return (
                                <div key={index} className="floatLeft">
                                    <span className="itemNumber">{indexTxt}.</span>
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
                </div>

                <button onClick={this.handleInput}
                        type="submit" id="submitItemBtn" className="btn btn-primary">CREATE
                </button>
                <button
                    id="findListBtn" className="btn btn-primary btn-bot">Find list
                </button>
            </form>
        );
    }
}

export default ShoppingListForm;
