var express=require("express");
var bodyParser=require("body-parser");
var mysql = require('mysql2');
var session = require('express-session');
var mycookie = require('cookie-parser');


var con = mysql.createConnection({
  host: "localhost",
  user: "varun2",
  password: "Example@123",
  database: "gift_shop"
});

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
})); 

const port = 5000;
app.listen(port, () => console.log('Listening on port 5000'));

app.use(session({secret:'WST-PROJECT'}));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/mysignup', function(req, res){
    res.sendFile(__dirname+'/views/mysignup.html');
});

app.post('/signup', function(req, res){
    var full_name = req.body.full_name;
    var email_id =req.body.email_id;
    var mob_number =req.body.mob_number;
    var city = req.body.city;
    var state = req.body.state;
    var password = req.body.password;
    var confpassword = req.body.confpassword;
    if (password != confpassword){
        res.sendFile(__dirname+'/views/mysignup.html');
    }
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO customer (id, full_name, email_id, mob_number, city, state, password) VALUES (NULL, '"+full_name+"','"+email_id+"', '"+mob_number+"', '"+city+"', '"+state+"', '"+password+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
    });
    res.sendFile(__dirname+'/views/mylogin.html');
});

app.get('/mylogin', function(req, res){
    //console.log(localStorage.getItem("id"));
    res.sendFile(__dirname+'/views/mylogin.html');
});

app.post('/login', function(req, res){
    var email_id = req.body.email_id;
    var password = req.body.password;
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM customer WHERE email_id = '"+email_id+"'", function(err, result) {
            if (err) throw err;
            console.log(result);
            //localStorage.setItem("id", result[0].id.toString());
            console.log(result[0].password);
            if(result[0].password === password){
                req.session.loggedin = true;
                req.session.cid = result[0].id;
                res.sendFile(__dirname+'/views/dashboard.html');
            }
            else{
                
                res.sendFile(__dirname+'/views/mylogin.html');
            }
        });
    });
    
});

app.get('/logout', function(req, res){
    res.sendFile(__dirname+'/views/mylogin.html');
});

app.post('/addtocart', function(req, res){
    var myid = req.body.select_gift;
    console.log(myid);
    con.connect(function(err){
        if (err) throw err;
        var sql = "SELECT * FROM gifts WHERE gift_id='"+myid+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            con.query("INSERT INTO cart VALUES('"+req.session.cid+"', '"+myid+"', '"+result[0].item_name+"', '"+result[0].price+"');", function(err, res1){
                if (err) throw err;
            });
            res.render(__dirname+'/views/mycart.ejs', {cont: result, cid: req.session.cid});
        });
    });   
});

app.post('/dopayment', function(req, res){
    mymode = req.body.mode;
    cardnum = req.body.cardnum;
    cvv = req.body.cvv;
    num = req.body.num;
    if(mymode == "UPI"){
        var sql = "SELECT * FROM cart WHERE c_id='"+req.session.cid+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            con.query("INSERT INTO payment VALUES('"+req.session.cid+"', '"+mymode+"', NULL, NULL, '"+num+"');", function(err, res){
                if (err) throw err;
            });
            res.render(__dirname+'/views/recpt.ejs', {cont: result, count: result.length, mymode: mymode, cardnum: cardnum, cvv: cvv, num: num});
        });
    } 
    else{
        var sql = "SELECT * FROM cart WHERE c_id='"+req.session.cid+"'";
        con.query(sql, function(err, result){
            if (err) throw err;
            con.query("INSERT INTO payment VALUES('"+req.session.cid+"', '"+mymode+"', '"+cardnum+"', '"+cvv+"', NULL);", function(err, res){
                if (err) throw err;
            });
            console.log(result.length)
            res.render(__dirname+'/views/recpt.ejs', {cont: result, count: result.length, mymode: mymode, cardnum: cardnum, cvv: cvv, num: num});
        });
    }
});

app.post('/endrec', function(req, res){
    res.sendFile(__dirname+'/views/dashboard.html');
});


//app.get('/mycartdisplay', function(req, res){
//    var sql = "SELECT * FROM cart WHERE c_id='"+req.session.cid+"'";
//    con.connect(function(err){
//        if (err) throw err;
//        con.query(sql, function(err, result){
//            if (err) throw err;
//            res.render(__dirname+'/views/mycart.ejs', { content: result });
//        });
//    });
//});
