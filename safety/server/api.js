const express = require('express');
const router = express.Router();

// const main = require('./router/main');


router.get('/', (req,res)=> {
    console.log('hello');
    res.send('hello');
})

// router.use('/main', main);

module.exports = router;

