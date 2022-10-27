const authenticateToken = require('./users');
const User = require('../models/Users');

const router = require('express').Router();

// TESTING

router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.admin === true) {
      const users = await User.find({ admin: false });
      res.status(200).json(users);
    } else {
      res.status(404).json('User have not admin rights');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/user/:id', authenticateToken, async (req, res) => {
  console.log('deleting user');
  try {
    if (req.user.admin === true) {
      const response = await User.findOneAndDelete({
        _id: req.params.id,
      });

      console.log(response);

      if (!response) {
        res.status(404).json('User is not here');
      } else {
        res
          .status(200)
          .json('User has been whose email is' + response.email);
      }
    } else {
      res.status(404).json('only admin can delete this user');
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
