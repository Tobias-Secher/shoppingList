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
        items: [listItemSchema],
        _id: String
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
        ShoppingList.findOne({}).sort('-_id').exec(function (err, list) {
            let title = req.body.title;
            let type = req.body.type;
            let items = req.body.items;
            let description = req.body.description;
            let dotColor = req.body.dotColor;
            let id = 0;
            if(list != undefined){
                id = parseInt(list._id) + 1;
            }

            let stringId = id.toString();

            let newShoppingList = new ShoppingList({
                title: title,
                type: type,
                dotColor: dotColor,
                items: items,
                description: description,
                _id: stringId
            });

            newShoppingList.save((err) => {
                if (err)
                    console.error(err)
            });

            //io.of('/shopping_list').emit('new-data', {msg: 'New data is available on /api/my_data'});

            res.status(200).json({id: newShoppingList._id, msg: `POST shoppingList: ${title}`});
        });
    });

    router.put('/:id', (req, res) => {
        ShoppingList.findOne({_id: req.params.id}).exec(function(err, list){
            list.items = req.body;
            list.save();
        })
    });

    router.delete('/delete/:id', function (req, res, next) {
        console.log(`REQ PARAMS ID: ${req.params.id}`)
        ShoppingList.findOne({_id: req.params.id}).exec(function (err, shoppinglist) {
            shoppinglist.remove();
            shoppinglist.save();

            //io.of('/shopping_list').emit('new-data', {msg: 'New data is available on /api/my_data'});

            res.json("succes")
        })

    });

    router.delete('/delete/item/:id', function (req, res, next) {

        console.log("vi er inde i delete item")

        ShoppingList.find({}, (err, list) => {

            list.forEach(function (elm) {
                elm.items.forEach(function (item) {
                    if (item._id == req.params.id) {
                        console.log("DETTE ER DIN KOMMENTAR" + item.item);
                        item.remove();
                        elm.save();

                    }
                })
            })
        });

        //io.of('/shopping_list').emit('new-data', {msg: 'New data is available on /api/my_data'});

        res.json("succes")
    });


    return router;
};