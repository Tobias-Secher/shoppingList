import React, {Component} from 'react';

class ShoppingListForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            type: "",
            description: "",
            items: [],
            errorMsg: ""
        };

        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.addItem();
    }

    addItem() {
        this.setState({items: [...this.state.items, {itemName: "", price: null}]})
    }

    randomColor(){
        let rgb = [];

        for(let i = 0; i < 3; i++){
            rgb.push(Math.floor(Math.random() * 255));
        }

        return `rgb(${rgb.join(',')})`;
    }

    handleItemTitleChange(e, index) {
        this.state.items[index].itemName = e.target.value;
        //set the state...
        this.setState({items: this.state.items});
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }
    }

    handleItemPriceChange(e, index) {
        this.state.items[index].price = parseInt(e.target.value);
        //set the state...
        this.setState({items: this.state.items});
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }
    }

    static isItemsNull(items){
        let isItemsNull = false;
        for(let i = 0; i < items.length - 1; i++){
            if(items[i].itemName === "" || items[i].price === "" || items[i].price === null){
                isItemsNull = true;
                console.log("true");
            }
        }
        return isItemsNull;
    }

    handleInput(event) {
        event.preventDefault();
        let items = this.state.items.slice();
        let title = this.state.title;
        if (title !== "") {
            if (items.length === 1) {
                this.setState({
                    errorMsg: "Tilføj mindst én ting."
                });
            } else if (ShoppingListForm.isItemsNull(items)) {
                this.setState({
                    errorMsg: "Husk både titel og pris!"
                });
            } else {
                items.pop();

                let shoppingList = {
                    _id: this.props.newId,
                    title: title,
                    items: items,
                    dotColor: this.randomColor(),
                    type: "normal",
                    description: "En kort beskrivelse af listen"
                };

                this.props.addShoppingList(shoppingList);
                this.props.history.push('/');
            }
        } else {
            this.setState({
                errorMsg: "Hovsa! Du glemte at give din liste et navn."
            })
        }
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
                <span className="errorMsg">{this.state.errorMsg}</span>
                <input type="text" name="title" id="title" className="titleInput" value={this.state.title}
                       onChange={this.onChange} placeholder="Inkøbsliste titel"/>

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
                                           value={item.itemName}
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
