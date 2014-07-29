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

var postButton = "<body><form action='/' method='post'> '<input type='text' name='item' placeholder='Enter an item'><button>Add Item</button></form></body>";
var editButtonPre = "<body><form action='/' method='post'><input type='hidden' name='index' value='";
var editButtonPost = "'><input type='text' name='item' placeholder='Edit the item'><button>Edit Item</button></form></body>";

var viewList = function (req,res) {
    itemsList = postButton+"<body><ul>";
    items.forEach(function(item, i) {
//        itemsList += "<li id='"+i+"'><a href='/"+i+"'>"+item+"</a>"+deleteButton+"</li>";
        itemsList += "<li id='"+i+"'><a href='/"+i+"'>"+item+"</a><a href='/"+i+"/delete'>    x</a></li>";
    });
    itemsList += "</ul></body>";
    res.writeHead(200,{"Content-Type": "text/html"});
    res.write(itemsList);
    res.end();
};

var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;

    var getItemNumFromUrl = function() {
        var pathname = url.parse(req.url).pathname;
        return parseInt(pathname.slice(1),10);
    };

    var handleItemNum = function(index) {
        if (isNaN(index)) {
            res.statusCode = 400;
            res.end('Item id is not valid');
        } else if (!items[index]) {
            res.statusCode = 404;
            res.end('Item not found');
        } else {
            return true;
        }
    };

    switch (req.method) {
        case 'POST':
            formData = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                formData += chunk;
            });
            req.on('end', function () {
                var formObj = qs.parse(formData);
                var idx = parseInt(formObj.index,10);
                var item = formObj.item;
                if(idx){
                    items[idx] = item;
                } else {
                    items.push(item);
                }
                viewList(req,res);
                res.end('Item added\n');
            });

            break;
        case 'GET':
            if(pathname.indexOf('delete')!== -1 ){
                idx = getItemNumFromUrl();
                if (handleItemNum(idx)) {
                    items.splice(idx,1);
                    viewList(req,res);
                    res.end('Item deleted successfully');
                    break;
                }
            } else if(typeof parseInt(pathname.slice(1),10) === "number" && !isNaN(parseInt(pathname.slice(1),10))) {
                idx = getItemNumFromUrl();
                res.writeHead(200,{"Content-Type": "text/html"});
                res.write(editButtonPre+idx+editButtonPost);
                res.end();
                break;
            } else {
                viewList(req, res);
                break;
            }

    }
});

server.listen(9001, function(){
    console.log('listening on 9001');
});