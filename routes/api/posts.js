const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');


const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route POST api/posts
// @desc create a post
// @access private

router.post(
  '/',
  [
    auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.any() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      })

      const post = await newPost.save();

      res.json(post);
    } catch (e) {
      console.log(e.message)
      res.status(500).send('servvv error')
    }
  }
)

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (e) {
    console.log(e.message)
    res.status(500).send('error at /api/post/')
  }
});

router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if(!post){
      res.status(404).json({msg: "no post with that id"})
    }
    res.json(post);
  } catch (e) {
    console.log(e.message)
    res.status(500).send('error at /api/post/')
  }
});

router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndRemove({ user: req.user.id, _id: req.params.postId });
    if(!post){
      res.status(404).json({msg: 'No post that you have made fits that postId'})
    }
    res.send('deleted');
  } catch (e) {
    console.log(e.message)
    res.status(500).send('problem deleting the post')
  }
})


router.put('/:postId/like', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if(!post){
      res.status(404).json({msg:'no post with that id'})
    }

    const like = post.likes.filter(item => {
      return item.user.toString() == req.user.id
    });

    if (like.length > 0 ){
      //delete
      var index_val;
      post.likes.forEach(function(item, index) {
        if(item.user.toString() === req.user.id){
          index_val = index
        }
      })
      post.likes.splice(index_val, 1)

      await post.save();
      res.send('done')
    }else{
      const newLike = post.likes.unshift({user: req.user.id})
      await post.save();
      res.json(post.likes)
    }


  } catch (e) {
    console.log(e.message)
    res.status(500).send('problem deleting the post')
  }
})
module.exports = router;
