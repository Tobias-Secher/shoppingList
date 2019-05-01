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

        res.status(200).json({id: newShoppingList._id, msg: `POST shoppingList: ${title}`});
    });

    router.put('/:id', (req, res) => {
        ShoppingList.findOne({_id: req.params.id}).exec(function(err, list){
            list.items = req.body;
            list.save();
        })
    });

    router.delete('/delete/:id', function (req, res, next) {

       console.log("vi er inde i delete api")
        //ShoppingList.findOneAndRemove({_id: req.params.id});
        //res.send('DELETE request to homepage')
        //ShoppingList.remove(ShoppingList.findOne({_id: req.params.id}))
        //ShoppingList.deleteOne({_id: req.params.id});
        //ShoppingList.save();
        //ShoppingList.findByIdAndDelete({'_id': req.params.id})

        //ShoppingList.collection.findByIdAndRemove({_id :req.params.id});

        ShoppingList.findOne({_id: req.params.id}).exec(function(err, shoppinglist){
            shoppinglist.remove();
            shoppinglist.save();
            res.json("succes")
        })

    });

    router.delete('/delete/item/:id', function (req, res, next) {

        console.log("vi er inde i delete item")

        /*ShoppingList.findOne({_id: req.params.id}).exec(function(err, shoppinglist){

            shoppinglist.item.forEach(function (item){

                    if(item._id == req.params.id){
                        console.log("DETTE ER DIT ITEM" + item.item);
                        item.remove();
                        res.json("succes deleting item")
                    }
            })

            item.save();
        })*/
    });

    return router;
};