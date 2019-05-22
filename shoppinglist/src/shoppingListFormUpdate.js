import React, { Component } from 'react';
//import DeleteButton from "@material-ui/core/SvgIcon/SvgIcon";
import DeleteButtonforItem from '@material-ui/icons/Clear';
import { openDB, deleteDB, wrap, unwrap } from 'idb';

class ShoppingListFormUpdate extends Component {
    api_url = process.env.REACT_APP_API_URL;

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
        this.updateInput = this.updateInput.bind(this);
        this.updateInputPrice = this.updateInputPrice.bind(this);
        this.getList = this.getList.bind(this);
        this.getList();
    }

    componentDidMount() {
        this.addItem();
    }

    addItem() {
        this.setState({ items: [...this.state.items, { itemName: "", price: Number }] })
    }

    handleItemTitleChange(e, index) {
        this.state.items[index].itemName = e.target.value;
        //set the state...
        this.setState({ items: this.state.items });
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }
    }

    handleItemPriceChange(e, index) {
        this.state.items[index].price = Number.parseInt(e.target.value);
        //set the state...
        this.setState({ items: this.state.items });
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }
    }

    handleItemRemoveChange(e, index) {
        console.log('remove item');
        let arr = this.state.items;
        arr.splice(index, 1);
        this.setState({
            items: arr
        });
        this.updateInput(e)
    }


    updateInput(e) {
        e.preventDefault();
        fetch(`${this.api_url}/shoppingLists/${this.props.match.params.id}`, {
            method: 'PUT',
            body: JSON.stringify(this.state.items),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }
    updateInputPrice(e) {
        e.preventDefault();
        // fetch(`${this.api_url}/shoppingLists/${this.props.match.params.id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify(this.state.items),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res => res.json())
        //     .then(response => console.log('Success:', JSON.stringify(response)))
        //     .catch(error => console.error('Error:', error));

        this.setState({
            price: this.calcPrice()
        })
    }

    calcPrice() {
        let price = Number;
        console.log('CALC HHIT')
        for (let i = 0; i < this.state.items.length; i++) {
            price = parseInt(this.state.items[i].price + price);
        }

        return price;

    }

    async getList() {
        let db = await openDB(this.props.DB_NAME, this.props.DB_VERSION)

        let transaction = db.transaction([this.props.DB_STORE], 'readwrite');
        let objectStore = transaction.objectStore(this.props.DB_STORE);
        this.state.items = [];
        this.state.title = "";
        objectStore.get(this.props.match.params.id).then(response => {
            this.setState({
                items: response.items,
                title: response.title
            })
        })
        db.close()
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

    HandleDeleteItem(event, data) {
        console.log(data);
        event.preventDefault();
        this.props.deleteItem(
            data
        );

    }
    render() {
        return (
            <form className="createListForm" method="post" action="#">

                <input type="text" name="title" id="title" className="titleInput" value={this.state.title}
                    onChange={this.onChange} placeholder="Inkøbsliste titel" />

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
                                        onChange={(e) => this.handleItemTitleChange(e, index)} placeholder="Title" onBlur={this.updateInput} />
                                    <input className="itemPriceInput" key={`itemPrice_${index}`} type="text"
                                        value={item.price} onChange={(e) => this.handleItemPriceChange(e, index)}
                                        placeholder="Price" type="number" onBlur={this.updateInputPrice} />

                                    <DeleteButtonforItem className="DeleteButtonforItem" onClick={((e) => this.handleItemRemoveChange(e, index))} />
                                </div>
                            )
                        })
                    }
                </div>
                <button
                    id="findListBtn" className="btn btn-primary btn-bot">Find list
                </button>
            </form>
        );
    }
}

export default ShoppingListFormUpdate;
