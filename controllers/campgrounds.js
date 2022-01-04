
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index')
const mboxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken =  process.env.mapbox_token;
const geocoder = mboxGeoCoding({accessToken: mapBoxToken});


module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
};

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
};

module.exports.createNew = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Sucessfully made a new park!');
    res.redirect(`/campgrounds/${campground._id}`)

};

module.exports.showCamp = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
    path:'reviews',
    populate:{
        path:'author'
    }
    }).populate('author');
    if(!campground){
        req.flash('error',"Can't find the park");
        return res.redirect(`/campgrounds`)
    }
    res.render('campgrounds/show',{campground});
};

module.exports.renderEditForm =  async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error',"Can't find the park");
        return res.redirect(`/campgrounds`)
    }

    res.render('campgrounds/edit',{campground});
};

module.exports.updateCamp = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground)
    campground.images.push(...req.files.map(f=>({url:f.path,filename:f.filename})));
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({
            $pull:{images:{filename:{$in: req.body.deleteImages}}}
        })
        
    }
    req.flash('success','Sucessfully updated a new park!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamp = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Sucessfully delete a park!');
    res.redirect(`/campgrounds`);
};