/**
 * Created by David on 7/23/2014.
 */
var http = require('http');
var url = require('url');
var qs = require('querystring');
var items = ["first","sec","third","fourth","fifth"];
var itemsList = "";
var idx;
var formData;

var postButton = "<body><form action='/' method='post'><input type='text' name='item' placeholder='Enter an item'><button>Add Item</button></form></body>";

var viewList = function (req,res) {
    itemsList = postButton+"<body><ul>";
    items.forEach(function(item, i) {
        itemsList += "<li id='"+i+"'><a href='/"+i+"'>"+item+"</a><a href='/"+i+"/delete'>    x</a></li>";
    });
    itemsList += "</ul></body>";
    res.writeHead(200,{"Content-Type": "text/html"});
    console.log(itemsList);
//            res.write(postButton);
    res.write(itemsList);
    res.end();
};

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    switch (req.method) {
        case 'POST':
            console.log('post was sent');
            formData = '';
            console.log('formData should be blank: and it is --->' + formData);
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                formData += chunk;
            });
            req.on('end', function () {
                var formObj = qs.parse(formData);
                items.push(formObj.item);
                console.log("items is " + items);
                viewList(req,res);
                res.end('Item added\n');
            });

            break;
        case 'GET':
            viewList(req,res);
            break;
        case 'DELETE':
            idx = getItemNumFromUrl();
            if (handleItemNum(idx)) {
                items.splice(idx,1);
                res.end('Item deleted successfully');
                console.log("items is " + items);
            }
            break;
        case 'PUT':
            idx = getItemNumFromUrl();
            if (handleItemNum(idx)) {
                item = '';
                req.setEncoding('utf8');
                req.on('data', function (chunk) {
                    item += chunk;
                });
                req.on('end', function () {
                    items[idx] = item;
                    res.end('Item changed\n');
                    console.log("items is " + items);
                });
            }
            break;
    }
});

server.listen(9001, function(){
    console.log('listening on 9001');
});