import React, { Component } from 'react';
//import DeleteButton from "@material-ui/core/SvgIcon/SvgIcon";
import DeleteButtonforItem from '@material-ui/icons/Clear';

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
        this.getList = this.getList.bind(this);
        this.getList();
    }

    componentDidMount() {
        this.addItem();
    }

    addItem() {
        this.setState({ items: [...this.state.items, { itemName: "", price: "" }] })
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
        this.state.items[index].price = e.target.value;
        //set the state...
        this.setState({ items: this.state.items });
        if ((this.state.items.length - 1) <= index) {
            this.addItem();
        }
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

    getList(){
        fetch(`${this.api_url}/shoppingLists/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          items: json.items,
          title: json.title
        })
      })
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

    HandleDeleteItem(event, data){
        console.log("delete item" + data);
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
                                        placeholder="Price" onBlur={this.updateInput} />

                                        <DeleteButtonforItem className="DeleteButtonforItem" onClick={((e) => this.HandleDeleteItem(e, item._id))}/>

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

export default ShoppingListFormUpdate;
