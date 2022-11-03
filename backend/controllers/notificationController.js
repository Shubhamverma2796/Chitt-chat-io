const User = require('../models/userModel');

const accessNotification = async (req,res) => {

    const user = await User.findById(
        req.params.userId
    )

    if(user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                notifications:user.notifications
            })
    } else {
        throw new Error("failed to create the user");
    }

}

const updateNotification = async (req,res) =>{
    const {userId,notification} = req.body;

    const updatedNotifcations = await User.findByIdAndUpdate(
        userId,
        {
            notifications:notification
        },
        {
            new: true,
        }
    )
    

    if (!updatedNotifcations) {
        res.status(400);
        throw new Error("Chat not found")
    } else {
        res.json(updatedNotifcations);
    }
       
}





module.exports = {accessNotification, updateNotification};
