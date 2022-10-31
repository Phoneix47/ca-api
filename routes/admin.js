const authenticateToken = require('./users');
const User = require('../models/Users');
const Doc = require('../models/Doc');
const router = require('express').Router();

const directory = '/home/mrrobot/Desktop/CA/backend/uploaded_Docs/';

//get the list of users expect admin

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

//delete user if u are admin
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

//upload document files

router.post('/doc', async (req, res) => {
  const fileName = Date.now() + '' + req.files.uploadfile.name;
  const file = req.files.uploadfile;
  let uploadPath = directory + fileName;

  file.mv(uploadPath, (err) => {
    console.log('ehej');
    if (err) {
      return res.send(err);
    }
  });

  const newDoc = new Doc({
    documentType: req.body.documentType,
    documentDesc: req.body.documentDesc,
    docUrl: uploadPath,
  });

  const document = await newDoc.save();

  res.status(200).json(document);
});

module.exports = router;
