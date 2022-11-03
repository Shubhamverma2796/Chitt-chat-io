const User = require('../models/userModel');
const generateToken = require('../config/generateToken');


const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
        res.status(400);
        // console.log()
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        throw new Error("failed to create the user");
    }
}


const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    // (await user.matchPassword(password))

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        throw new Error("failed to create the user");
    }
}
// /api/user?search=shubham
const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        //mongo db or operator
        //i means case sensitive    
        $or : [
            {name : {$regex: req.query.search , $options: "i"}},
            {email : {$regex: req.query.search , $options: "i"}},
        ]
    }: {}

    const users = await User.find(keyword).find({_id: {$ne : req.user._id}});
    res.send(users);
}



module.exports = { registerUser, authUser, allUsers };