
var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1:27017/chat', function (err, base) {
    if (err) throw err;

    client.on('connection', function (socket) {

        var col = base.db('chat').collection('messages')
            sendStatus = function(s){
                socket.emit('status',s);
            }
        ;

        //emit all messages


        col.find({}).limit(100).sort({_id:1}).toArray(function(err, res){
            socket.emit('output',res);
        })

        //end emit all messages

        socket.on('input', function (data) {
            var name = data.name,
                message = data.message
            whitespacePattern = /^\s*$/
                ;

            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                sendStatus("name and message is requied");
            }
            else {
                col.insert({ name: name, message: message }, function () {
                    
                    client.emit('output',[data]);
                    
                    sendStatus({
                        message: "mess sent",
                        clear: true
                    })
                });
            }

        });

    });

    if (!err) {
        console.log("ok");
    }

});





