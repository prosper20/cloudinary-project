const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const Post = require('../models/postModel');



router.post('/', upload.array('images', 5 ), async (req, res) => {
    try {
        let images = [];
        if (typeof req.files === "string") {
         images.push(req.files);
        } else {
         images = req.files;
        }
        let result = [];
        for (let i = 0; i < images.length; i++){
            let image = await cloudinary.uploader.upload(images[i].path);
            let { public_id, secure_url } = image;
            result.push({ public_id, secure_url });
        }
        
        //create instance of Post
        let post = new Post({
            caption: req.body.caption,
            images: result
        });
        //save post to database
        await post.save();
        res.json(post); 
    } catch (error) {
        console.log(error);
    }
});

//get posts
router.get('/', async (req, res) => {
    try {
        let post = await Post.find();
        !post && console.log('user not found');
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});

//get a specific post by id
router.get('/:id', async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        !post && console.log('post not found');
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});
//delete a post by id
router.delete('/:id', async (req, res) => {
    try {
        //find post by id
        let post = await Post.findById(req.params.id);
        !post && console.log('post not found');
        //delete post images from cloudinary
        for (let i = 0; i < post.images.length; i++){
            await cloudinary.uploader.destroy(post.images[i].public_id);
        }
        //delete post form database
        await post.remove();
        res.json(post);
    } catch (error) {
        console.log(error);
    }
});
//update all images in a post 
router.put('/:id', upload.array('images', 5 ), async (req, res) => {
    try {
        //find post in the database using the id
        let post = await Post.findById(req.params.id);
        !post && console.log('post not found');
        //delete previouse images from cloudinary
        for (let i = 0; i < post.images.length; i++){
            await cloudinary.uploader.destroy(post.images[i].public_id);
        }
        //upload new images to cloudinary
        let images = [];
        if (typeof req.files === "string") {
         images.push(req.files);
        } else {
         images = req.files;
        }
        let result = [];
        for (let i = 0; i < images.length; i++){
            let image = await cloudinary.uploader.upload(images[i].path);
            let { public_id, secure_url } = image;
            result.push({ public_id, secure_url });
        }
        const data = {
            caption: req.body.caption || post.caption,
            images: result || post.images
        };

        post = await Post.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json(post);

    } catch (error) {
        console.log(error);
    }
}); 

//update some or all fields of a post
router.patch('/:id', upload.array('images', 5 ), async (req, res) => {
    try {

         //find post in the database using the id
         let post = await Post.findById(req.params.id);
         !post && console.log((new Error('post not found')));
         
        //delete previouse images from cloudinary
        if (req.query.images) {
            const imageId = req.query.images.toString().split(',');
            for (let i = 0; i < imageId.length; i++){
                await cloudinary.uploader.destroy(imageId[i]);

                for (let j = 0; j < post.images.length; j++){
                    /*if (!post.images[j]){
                        break;
                    }*/
                    if (imageId[i] === post.images[j].public_id) {
                        await Post.updateOne({ }, { $pull: { images: { public_id: imageId[j] } } });//is does't work check it out
                    }
                }
            }
        }


        //upload new images to cloudinary
        let result = [];
        if (req.files){
            let images = [];
            if (typeof req.files === "string") {
                images.push(req.files);
            } else {
                 images = req.files;
            }
       
            for (let i = 0; i < images.length; i++){
                let image = await cloudinary.uploader.upload(images[i].path);
                let { public_id, secure_url } = image;
                result.push({ public_id, secure_url });
            }
        }
        
        const data = {
            caption: req.body.caption || post.caption,
            images: [ ...result, ...post.images ] || post.images
        };

        post = await Post.findByIdAndUpdate(req.params.id, data);
        res.json(post); 

    } catch (error) {
        console.log(error);
    }
});



module.exports = router;