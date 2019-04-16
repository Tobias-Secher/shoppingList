import React, {Component} from 'react';

class ShoppingListForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            items: ""
        };



        this.handleInput = this.handleInput.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleInput(event) {
        event.preventDefault();

        let shoppingList = {
            title: this.state.title,
            items: this.state.items.split(',')
        }

        this.props.addShoppingList(shoppingList);
    }

    onChange(event) {
        let id = event.target.id;
        let value = event.target.value;
        //console.log(id);

        if (id === "title") {
            this.setState({
                title: value
            })
        } else if (id === "item") {
            this.setState({
                items: value
            });
        }
    }

    render() {
        return <form method="post" action="#">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" onChange={this.onChange}/>
            <input type="text" name="item" id="item" className="itemInput" placeholder="Item name" onChange={this.onChange}/>
            <button onClick={this.handleInput}
                    type="submit" id="submitItemBtn" className="btn btn-primary">CREATE
            </button>
        </form>
            ;
    }
}

export default ShoppingListForm;
