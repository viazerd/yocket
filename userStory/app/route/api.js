var User = require('../model/user');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

//Separate function to create our tokens
function createToken(user){
   var token = jsonwebtoken.sign({
       _id: user._id,
       name: user.name,
       username:user.username
    }, secretKey,{expiresIn:60*60*24});

   return token;
}



module.exports = function(app,express){

    var api = express.Router();
    //passing the data to the DB

    api.post('/signup',function(req,res){
        var user = new User({
            name:req.body.name,
            username:req.body.username,
            password:req.body.password
        });//body here is the body parser for reading the value from the DB

        //Now saving it on the DB

        user.save(function(err){
            if(err){
                res.send(err);
                return;
            }
            res.json({message:'User has been created'});
        });
    });

    api.get('/users',function(req,res){

        User.find({},function(err,users){
            if(err){
                res.send(err);
                return;
            }
            res.json(users);
        })
    });

    api.post('/login',function(req,res){

       User.findOne({
           username:req.body.username
       }).select('name username password').exec(function(err,user){
            if(err) throw err;

            if(!user){
                res.send({message:"User doesnt exist"});
            }else if(user){
                var validPassword = user.comparePassword(req.body.password);
                if(!validPassword){
                    res.send({message:"invalid Password"});
                }else{// If the password is valid then we create a token and we can decode the info in the token
                    var token = createToken(user);
                    res.json({
                        success:true,
                        message:"Successfully Logged In!!",
                        token:token
                    });
                }
            }
        })
    });

//End of Start Point before Middleware
    //Middleware for Secure Loggin in

    api.use(function(req,res,next){

        console.log("Welcome to our App!!");

        // We want to make sure if we have the right token
        var token = req.body.token || req.params.token||req.headers['x-access-token'];
        console.log(token);
        if(token){
            jsonwebtoken.verify(token,secretKey,function(err,decoded){
                if(err){
                    res.status(403).send({success:false,message:"Authentication Failed"});
                }else{
                    req.decoded=decoded;

                    next();
                }
            });
        }else{
            console.log(token);
            //res.status(403).send({success:false,message:"No token Provided"});
        }
    });

//End Destination

    api.get('/',function(req,res){
        res.json(req.decoded);
    });
return api;
};
