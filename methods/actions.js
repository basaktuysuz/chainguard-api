var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')

var functions = {
    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password,
                phoneNo : req.body.phoneNo
            });
            newUser.save()
                .then(savedUser => {
                    res.json({success: true, msg: 'Successfully saved'})
                })
                .catch(err => {
                    res.json({success: false, msg: 'Failed to save'})
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
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: 'Hello ' + decodedtoken.name})
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    }
}

module.exports = functions