const Food = require('../models/food');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
let randomNum = Math.floor(Math.random() * 10)


module.exports.index = async (req, res) => {
    const foods = await Food.find({}).populate('popupText');
    res.render('foods/index', { foods })
}

module.exports.renderNewForm = (req, res) => {
    res.render('foods/new');
}

module.exports.createFood = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.food.location,
        limit: 10,
    }).send()
    const food = new Food(req.body.food);
    food.geometry = geoData.body.features[randomNum].geometry;
    food.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    food.author = req.user._id;
    await food.save();
    console.log(food);
    req.flash('success', 'Successfully made a new iconic food!');
    res.redirect(`/foods/${food._id}`)
}

module.exports.showFood = async (req, res,) => {
    const food = await Food.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!food) {
        req.flash('error', 'Cannot find that iconic food');
        return res.redirect('/foods');
    }
    res.render('foods/show', { food }); 
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const food = await Food.findById(id)
    if (!food) {
        req.flash('error', 'Cannot find that iconic food!');
        return res.redirect('/foods');
    }
    res.render('foods/edit', { food });
}

module.exports.updateFood = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const food = await Food.findByIdAndUpdate(id, { ...req.body.food });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    food.images.push(...imgs);
    if(req.body.deleteImages && food.images.length - req.body.deleteImages.length <1){
        req.flash('error', 'At least one image is required');
        res.redirect(`/foods/${food._id}/edit`)
    }else{
        await food.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await food.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        req.flash('success', 'Successfully updated!');
        res.redirect(`/foods/${food._id}`)
    }
    
}

module.exports.deleteFood = async (req, res) => {
    const { id } = req.params;
    await Food.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted')
    res.redirect('/foods');
}