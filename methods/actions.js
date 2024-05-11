var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password) || (!req.body.phoneNo) || (!req.body.fullname) || (!req.body.userId)) {
            res.json({success: false, msg: 'Enter all required fields'})
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password,
                fullname: req.body.fullname, // fullname alanını al
                phoneNo: req.body.phoneNo,
                role: req.body.role, // role alanını al
                userId: req.body.userId 
            });
            newUser.save()
                .then(savedUser => {
                    res.json({success: true, msg: 'User successfully saved'})
                })
                .catch(err => {
                    res.json({success: false, msg: 'Failed to save user'})
                });
        }
    },
    authenticate: function (req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    res.status(403).send({ success: false, msg: 'Authentication Failed, User not found' });
                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user, config.secret);
                            res.json({ success: true, token: token });
                        } else {
                            return res.status(403).send({ success: false, msg: 'Authentication failed, wrong password' });
                        }
                    });
                }
            })
            .catch(err => {
                // Hata durumunda burada işleyin
                console.error(err);
                res.status(500).send({ success: false, msg: 'Internal Server Error' });
            });
    },
    getinfo: function (req, res) {
        try {
            const allUser= User.find({}).lean();
            res.send({status : "ok", data : allUser});
        } catch (error) {
            console.log(error);
        }
    },
    fetchdata: function(req, res, next) {
        var resultArray = [];
        mongo.connect(url, function(err, db){
          assert.equal(null, err);
          var cursor = db.collection('users').find();
          cursor.forEach(function(doc, err){
            assert.equal(null, err);
            resultArray.push(doc);
          }, function(){
            db.close();
            //I have no index file to render, so I print the result to console
            //Also send back the JSON string bare through the channel
            console.log(resultArray);
            res.send(resultArray);
          });
        });
      }
}

module.exports = functions