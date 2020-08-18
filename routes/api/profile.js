const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult } = require('express-validator')
const axios = require('axios');

const Profile = require('../../models/Profile');
const User = require('../../models/User');




// @route       GET api/profile/me
// @description Get current users Profile
// @access      Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.status(400).json({ msg: 'There is no profile for this user'})
    }

    res.json(profile);
  }catch(err){
    console.log(err.message);
    res.sendStatus(500)
  }
});


// @route       POST api/profile
// @description Create or update user profile
// @access      Private
router.post('/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.sendStatus(400).json({ errors:errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({user: req.user.id})

      if(profile){
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500)

      console.log(profileFields.skills)

      res.send(profileFields)
    }
}
)

// @route       GET api/profile
// @description Get all profiles
// @access      Public
router.get('/', async (req, res) => {

  try {
    const profile = await Profile.find({}).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.send(400).json({msg: 'there are no profiles'})
    }

    res.json(profile);
  }catch(err){
    console.log(err.message);
    res.sendStatus(500)
  }

});

router.get('/user/:userId', async(req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const profile = await Profile.find({user: user}).populate('user', ['name', 'avatar']);

    if(!profile){
      return res.send(400).json({msg: 'there is no profile with that id'})
    }
    res.json(profile);

  }catch(err){
    console.log(err.message);
    res.sendStatus(500)
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id});
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({msg: 'User is deleted'})
  }catch (err) {
    console.log(err.message)
    res.status(500)
  }
});

// @route       PUT     api/profile/experience
// @desc        Add Profile experience
// @paccess     Private

router.put('/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try{
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile);
    }catch(err){
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }
);

// @route       DELETE api/profile/experience/:exp_id
// @desc        edit Profile experience
// @paccess     Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});

    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  }catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
});


// @route       PUT     api/profile/experience
// @desc        Add Profile experience
// @paccess     Private

router.put('/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try{
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile);
    }catch(err){
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }
);





// @route       PUT     api/profile/education
// @desc        Add Profile education
// @access     Private

router.put('/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try{
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu)

      await profile.save()

      res.json(profile);
    }catch(err){
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }
);


// @route       DELETE api/profile/education/:edu_id
// @desc        edit Profile education
// @paccess     Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});

    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  }catch(err) {
    console.log(err.message);
    res.status(500).send('Server Error')
  }
});


// @route       GET api/profile/github/:username
// @desc        GET user repos from github
// @paccess     Private
router.get('/github/:username', async (req, res) => {
  try{
    const result = await axios.get(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id${config.get('githubClientID')}&client_secret=${config.get('githubClientSecret')}`)
    res.json(result.data)
  }catch(err){
    console.error(err.message)
    res.status(500).send('serverrrrr error');
  }
})

module.exports = router;
