const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save().then((user) => {
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            console.log("Error auth controller 1:", err);
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save().then(() => {
            res.send({ message: "User was registered successfully!" });
          }).catch(err => {
            if (err) {
              console.log("Error auth controller 2:", err);
              res.status(500).send({ message: err });
              return;
            }
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }).then((role) => {
        user.roles = [role._id];
        user.save().then(() => {
          res.send({ message: "User was registered successfully!" });
        }).catch(err => {
          if (err) {
            console.log("Error 3:", err);
            res.status(500).send({ message: err });
            return;
          }
        });
      }).catch((err) => {
        if (err) {
          console.log("Error 4 :", err);
          res.status(500).send({ message: err });
          return;
        }
      });
    }
  }).catch((err) => {
    if (err) {
      console.log("Error 5:", err);
      res.status(500).send({ message: err });
      return;
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    }).catch((err) => {
      if (err) {
        console.log("Error 6:", err);
        res.status(500).send({ message: err });
        return;
      }
    });
};


exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};