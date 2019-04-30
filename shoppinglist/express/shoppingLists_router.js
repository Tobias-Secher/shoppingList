module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const mongoose = require('mongoose');

    // let shoppingListItem = new mongoose.model('listItem', {
        
    // })

    let listItemSchema = mongoose.Schema({
        itemName: String,
        price: Number,
    });
    let ShoppingList = mongoose.model('ShoppingList', {
        title: String,
        type: String,
        description: String,
        dotColor: String,
        items: [listItemSchema]
    });

    router.get('/', (req, res) => {
        ShoppingList.find({}, (err, lists) => {
            res.send(lists);
        })
    });

    router.get('/:id', (req, res) => {
        ShoppingList.findOne({_id: req.params.id}, (err, list) => {
            res.send(list);
        });
    });

    router.post('/', (req, res) => {
        let title = req.body.title;
        let type = req.body.type;
        let items = req.body.items;
        let description = req.body.description;
        let dotColor = req.body.dotColor;

        let newShoppingList = new ShoppingList({
            title: title,
            type: type,
            dotColor: dotColor,
            items: items,
            description: description
        });

        newShoppingList.save((err) => {
            if(err)
                console.error(err)
        });

        res.status(200).json({id: newShoppingList._id, msg: `POST shoppingList: ${title}`});
    });

    router.put('/:id', (req, res) => {
        ShoppingList.findOne({_id: req.params.id}).exec(function(err, list){
            list.items = req.body;
            list.save();
        })
    });

    return router;
};