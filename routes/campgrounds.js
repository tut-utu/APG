


const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware');
const {CampgroundSchema} = require('../schemas')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({ storage});




router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn ,upload.array('image'),validateCampground,catchAsync(campgrounds.createNew))



router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
.get(catchAsync(campgrounds.showCamp))
.put(isLoggedIn ,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCamp))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))
// router.get('/', catchAsync(campgrounds.index));







// router.post('/',isLoggedIn ,validateCampground,catchAsync(campgrounds.createNew))

// router.get('/:id',catchAsync(campgrounds.showCamp));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

// router.put('/:id',isLoggedIn ,validateCampground,catchAsync(campgrounds.updateCamp));

// router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));


module.exports = router;