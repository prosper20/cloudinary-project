const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const User = require('../models/userModel');


router.post('/', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        //create instance of user
        let user = new User({
            name: req.body.name,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        });
        //save user to database
        await user.save();
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

router.get('/', async (req, res) => {
    try {
        let user = await User.find();
        !user && console.log('user not found');
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        //find user by id
        let user = await User.findById(req.params.id);
        !user && console.log('user not found');
        //delete user from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);
        //delete user form database
        await user.remove();
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        //find user in the database using the id
        let user = await User.findById(req.params.id);
        !user && console.log('user not found');
        //delete previouse image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);
        //upload new image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        const data = {
            name: req.body.name || user.name,
            avatar: result.secure_url || user.avatar,
            cloudinary_id: result.public_id || user.cloudinary_id
        };

        user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(user);

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;