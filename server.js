var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function(){
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.listItems = function(){
    console.log("\n//Current Storage List//");
    for(var i=0; i < this.id; i++){
        console.log("name: " + this.items[i].name + " id: " + this.items[i].id);
    }
};

Storage.prototype.deleteItem = function(indexDelete){
    var toDelete = this.items[indexDelete];
    this.id -= 1;
    this.items.splice(indexDelete, 1);
    //reorder the exising items on the list
    for(var i=0; i< this.id; i++){
        this.items[i].id = i;
    };
    return toDelete;
};

Storage.prototype.editItem = function(request){
    this.items[request.body.id].name = request.body.name;
    var edit = this.items[request.body.id];
    return edit;
};

var storage = new Storage();
storage.add("Broad beans");
storage.add("Tomatoes");
storage.add("Peppers");

var app = express();
app.use(express.static('public'));

//GET Shopping list
app.get('/items',function(request, response){
    response.json(storage.items);
});

//POST New list item
app.post('/items', jsonParser, function(request, response){
   if(!request.body){
       return response.sendStatus(400);
   } 
   var item = storage.add(request.body.name);
   response.status(201).json(item);
});

//DELETE List item
app.delete('/items/:id', jsonParser, function(request, response){
   var deadItem = request.params.id;
   if(deadItem > storage.id || deadItem < 0){ 
        return response.sendStatus(400);
   }else{
        var goneItem = storage.deleteItem(deadItem);
        response.status(200).json(goneItem);
   }
});

//PUT List item
app.put('/items/:id', jsonParser, function(request, response){
    var changeItem = request.params.id;
    if(changeItem > storage.id && changeItem >= 0){
        var item = storage.add(request.body.name);
        response.status(201).json(item);
    }else if(changeItem < 0){
        return response.sendStatus(400);
    }else{
        var editItem = storage.editItem(request);
        response.status(200).json(editItem);
    }
});

app.listen(process.env.PORT || 8080);
console.log("Shopping List Online");

//exports for testing
exports.app = app;
exports.storage = storage;