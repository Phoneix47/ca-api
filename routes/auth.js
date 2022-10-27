const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const wish = require('../routes/users');

const User = require('../models/Users');

/**
 * @swagger
 *
 * components:
 *   schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - admin
 *
 *      properties:
 *        email:
 *            type : string
 *            description : email to log and signup a user
 *
 *        password:
 *            type : string
 *            description : need password for user authentication
 *
 *        admin:
 *            type: boolean
 *            description : flag to see user is admin or normal user
 *        example :
 *          email : "ajay@gmail.com"
 *          password : 1898192jdjshdjhjsdsd
 *          admin : true
 */

router.use(cors());

//signup
router.post('/signup', async (req, res) => {
  try {
    console.log('hiting');
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hashPassword,
      admin: req.body.admin,
    });

    console.log(newUser);

    const user = await newUser.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json('user not found');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    !validPassword && res.status(400).json('user not found');

    const userData = {
      userId: user._id,
      email: user.email,
      admin: user.admin,
    };

    const accessToken = jwt.sign(
      userData,
      process.env.ACCESS_TOKEN_SECRET
      // {
      //   expiresIn: '1800',
      // }
    );

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
