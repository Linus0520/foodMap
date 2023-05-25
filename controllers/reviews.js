const Food = require('../models/food');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const food = await Food.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    food.reviews.push(review);
    await review.save();
    await food.save();
    req.flash('success', 'New recommendation created!');
    res.redirect(`/foods/${food._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Food.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted recommendation')
    res.redirect(`/foods/${id}`);
}
