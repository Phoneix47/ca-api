const router = require('express').Router();
const Document = require('../models/Doc');
// const User = require('../models/Users');
const AdminUser = require('../models/adminUser')
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');




//authenticateUser
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, userData) => {
        if (err) return res.sendStatus(403);
        req.user = userData;
  
        next();
      }
    );
  }

//configuration
cloudinary.config({
  cloud_name: 'dzejdfmma',
  api_key: '933815445382538',
  api_secret: 'UlZ5dAY_geVzPfEp8BVGitcEp_o',
});



router.delete('/delete', authenticateToken, async (req, res) => {
    console.log(req.user.admin)
  try {
    if(req.user.admin === true) {
        console.log(typeof req.user.admin)
        await Users.findOneAndDelete({ email: req.body.email });
        res.status(200).json('User has been deleted');

    } else {
        res.status(404).json('only admin can delete this user');

    }
        
    

        

    
 
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});


module.exports = router;
