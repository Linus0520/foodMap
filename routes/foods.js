const express = require('express');
const router = express.Router();
const foods = require('../controllers/foods');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateFood } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Food = require('../models/food');

router.route('/')
    .get(catchAsync(foods.index))
    .post(isLoggedIn, upload.array('image'), validateFood, catchAsync(foods.createFood))


router.get('/new', isLoggedIn, foods.renderNewForm)

router.route('/:id')
    .get(catchAsync(foods.showFood))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateFood, catchAsync(foods.updateFood))
    .delete(isLoggedIn, isAuthor, catchAsync(foods.deleteFood));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(foods.renderEditForm))



module.exports = router;