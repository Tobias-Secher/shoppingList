module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const mongoose = require('mongoose');

    let ShoppingList = mongoose.model('ShoppingList', {
        title: String,
        type: String,
        description: String,
        items: Array
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

        let newShoppingList = new ShoppingList({
            title: title,
            type: type,
            items: items,
            description: description
        });

        newShoppingList.save((err) => {
            if(err)
                console.error(err)
        });

        res.status(501).json({msg: `POST shoppingList: ${title}`});
    });

    router.put('/', (req, res) => {
        // TODO: Implement shoppingList update.
        res.status(501).json({msg: "PUT update shoppingList not implemented"});
    });

    return router;
};