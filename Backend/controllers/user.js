const GroupModel = require("../models/Group");
const TweetModel = require("../models/Tweet");
const UserModel = require("../models/User");


const getUserAccount = async (req, res) => {
    try {
        const userId = req.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user found'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'User found',
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server occured', error });
    }
}

const getUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).select("-password");
        return res.status(200).json({ success: true, message: 'User found', user });
    } catch (error) {
        console.log('Some error occured', error);
        res.status(500).json({ message: 'Internal server occured', error });
    }
}

const getJoinedGroups = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId || userId == '') {
            return res.status(400).json({
                success: true,
                message: 'Please provide correct information'
            });
        }
        const user = await UserModel.findById(userId).populate({ path: 'groups', select: 'gName gDesc' });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No User found'
            });
        }
        const joinedGroups = user.groups;
        return res.status(200).json({
            success: true,
            message: 'Groups fetched',
            joinedGroups
        });
    } catch (error) {
        console.log('Some error occured', error);
        res.status(500).send('Internal server occured');
    }
}

const ownedGroup = async (req, res) => {
    try {
        const userId = req.user;
        const ownedGroups = await GroupModel.find({ leader: userId }).select("-domains -members -goal -anyoneCanJoin -gDesc");
        if (!ownedGroups) {
            return res.status(400).json({
                success: false,
                message: 'No groups created'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Groups found',
            ownedGroups
        });
    } catch (error) {
        res.status(500).send('Internal server occured');
    }
}

const myPosts = async (req, res) => {
    try {
        const userId = req.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user found'
            });
        }
        console.log(user);
        const posts = await TweetModel.find({ userId: userId }).populate({
            path: 'groupId',
            select: 'gName'
        });
        if (!posts) {
            return res.status(400).json({
                success: false,
                message: `No Posts available`
            });
        }
        return res.status(200).json({
            success: true,
            message: `Posts fetched`,
            posts
        });
    } catch (error) {
        return res.status(500).send('Internal server occured');
    }
}

const rateUser = async (req, res) => {
    try {
        const { userId: rateUser, rate } = req.body;
        const userId = req.user;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user found'
            });
        }
        const ratedUser = await UserModel.findById(rateUser);
        if (!ratedUser) {
            return res.status(400).json({
                success: false,
                message: 'No user found'
            });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(rateUser, {
            $set: { rate: rate }
        });
        console.log(updatedUser);
        return res.status(200).json({
            success: true,
            message: `User rated`,
            updatedUser,
        });
    } catch (error) {
        return res.status(500).send('Internal server occured');
    }
}

module.exports = {
    getUser,
    getJoinedGroups,
    getUserAccount,
    ownedGroup,
    myPosts,
    rateUser,
};