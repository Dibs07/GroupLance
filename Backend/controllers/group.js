const GroupModel = require("../models/Group");
const UserModel = require("../models/User");
const ejs = require('ejs');
const path = require('path');
const sendMail = require("../utils/sendmail");
const TweetModel = require("../models/Tweet");
const ConversationModel = require("../models/Conversation");
const MessageModel = require("../models/Message");
const InviteModel = require("../models/Invite");

const createGroup = async (req, res) => {
    try {
        const {
            leader,
            gName,
            gDesc,
            projName,
            goal,
            domains,
            publicGroup,
            anyoneCanJoin,
        } = req.body;

        if (!leader || !gName || !projName || !goal) {
            return res.status(400).json({
                success: false,
                message: 'Please enter required fields'
            });

        }
        const existingLeader = await GroupModel.find({ leader: leader });
        if (existingLeader.length > 2) {
            return res.status(400).json({
                success: false,
                message: `Couldn't create another group`
            });
        }
        // if (groupMembers < 2 || groupMembers > 4) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid group member'
        //     });
        // }

        //Check is another group exists or not
        const existingGroup = await GroupModel.findOne({ gName: gName });
        if (existingGroup) {
            return res.status(400).json({
                success: false,
                message: 'Another group exists with same name'
            });
        }
        const members = [leader];
        // Create new group
        const data = {
            leader: leader,
            gName: gName,
            projName: projName,
            gDesc: gDesc,
            domains: domains,
            goal: goal,
            publicGroup: publicGroup,
            anyoneCanJoin: anyoneCanJoin,
            gMemberNumber: members.length,
            members: members,
        };
        const newGroup = await GroupModel.create(data);
        if (!newGroup) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create new group due to some error occured on DB',
            });
        }
        for (let i = 0; i < members.length; i++) {
            await UserModel.findByIdAndUpdate(members[i], { "$push": { groups: newGroup._id } });
        }

        const leaderName = await UserModel.findById(leader);
        const mailData = {
            leader: leaderName.name,
            group: newGroup,
            domains: domains.toString(),
            groupType: publicGroup ? 'Public' : 'Private',
            whoCanJoin: anyoneCanJoin ? 'Anyone can join' : 'Join with invitation'
        };

        try {
            await sendMail({
                email: leaderName.email,
                subject: 'Group Creation Mail',
                template: 'create_group_mail.ejs',
                data: mailData
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Failed to send message'
            });
        }

        const newConversation = await ConversationModel.create({
            group: newGroup._id,
            userIds: [leader],
        })

        return res.status(200).json({
            success: true,
            message: `New group created. Group creation mail sent to ${leaderName.email}`,
            newGroup,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            successs: false,
            message: 'Internal server error',
            error
        });
    }
}

const joinRequest = async (req, res) => {
    try {
        const userId = req.user;
        const { groupId, invitationLink } = req.body;
        const existsUser = await UserModel.findById(userId);
        const existGroup = await GroupModel.findById(groupId).populate({ path: 'leader', select: 'name email' });
        console.log(existGroup);
        if (!existGroup) {
            return res.status(400).json({
                success: false,
                message: 'No group exists with this Id'
            });
        }
        let isMemberExistsInGroup = false;
        for (let i = 0; i < existGroup.members.length; i++) {
            if (existGroup.members[i].toString() === userId) {
                isMemberExistsInGroup = true;
            }
        }
        await GroupModel.findByIdAndUpdate(groupId, { $push: { pendingRequest: userId } });
        const data = {
            user: existsUser,
            leader: existGroup.leader.name,
            group: existGroup,
            invitationLink,
        };
        try {
            await sendMail({
                email: existGroup.leader.email,
                subject: 'Group Join Request',
                template: 'join_request_mail.ejs',
                data
            });
            return res.status(200).json({
                success: true,
                message: `Invitation mail sent to ${existGroup.leader.email}`,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to send message',
                error
            });
        }
    } catch (error) {
        res.status(500).json({
            successs: false,
            message: 'Internal server error'
        });
    }
}

const inviteMember = async (req, res) => {
    try {

        const { invitedUserMail, invitationLink, group, inviterName } = req.body;
        if (invitedUserMail == '' || invitationLink == '' || group == null || inviterName == '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields',
            });
        }
        const existUser = await UserModel.findOne({ email: invitedUserMail });
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: 'No User found with this email Id'
            });
        }
        const existGroup = await GroupModel.findById(group.id).populate("leader", "_id");
        if (!existGroup) {
            return res.status(400).json({
                success: false,
                message: 'No group exists with this Id'
            });
        }
        let isMemberExistsInGroup = false;
        for (let i = 0; i < existGroup.members.length; i++) {
            if (existGroup.members[i].toString() === existUser.id) {
                isMemberExistsInGroup = true;
            }
        }
        if (isMemberExistsInGroup) {
            return res.status(400).json({
                success: false,
                message: 'User already in group'
            });
        }
        await InviteModel.create({
            invitedUser: existUser._id,
            invitedBy: existGroup.leader._id,
            group: existGroup._id
        });
        const data = {
            user: {
                hostName: inviterName,
                invitedName: existUser.name,
            },
            invitationLink,
            group
        };
        try {
            await sendMail({
                email: invitedUserMail,
                subject: 'Group Invitation Mail',
                template: 'group_invitation_mail.ejs',
                data
            });
            return res.status(200).json({
                success: true,
                message: `Invitation mail sent to ${invitedUserMail}`,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to send message',
                error
            });
        }
    } catch (error) {
        res.status(500).json({
            successs: false,
            message: 'Internal server error'
        });
    }
}

const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user;
        if (groupId == '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }
        const existGroup = await GroupModel.findById(groupId).populate("leader", "_id");
        if (!existGroup) {
            return res.status(400).json({
                success: false,
                message: 'No such group exists'
            });
        }
        const existUser = await UserModel.findById(userId);
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exists`
            });
        }
        let isMemberExistsInGroup = false;
        for (let i = 0; i < existGroup.members.length; i++) {
            if (existGroup.members[i].toString() === existUser.id) {
                isMemberExistsInGroup = true;
            }
        }
        if (isMemberExistsInGroup) {
            return res.status(400).json({
                success: false,
                message: 'User already in group'
            });
        }
        await UserModel.findByIdAndUpdate(userId, { $push: { groups: groupId } });
        await GroupModel.findByIdAndUpdate(groupId, { $inc: { gMemberNumber: 1 }, $push: { members: userId } });
        await ConversationModel.findOneAndUpdate({ group: groupId }, { $push: { userIds: userId } });
        await InviteModel.findOneAndDelete({ group: groupId, invitedUser: existUser._id, invitedBy: existGroup.leader._id });
        return res.status(200).json({
            success: true,
            message: 'User added to the group successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const addMember = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        const leaderId = req.user;
        const existsGroup = await GroupModel.findById(groupId);
        if (!existsGroup || existsGroup.leader.toString() !== leaderId) {
            return res.status(400).json({
                success: false,
                message: `Group couldn't find or only leader can change`
            });
        }
        const existsUser = await UserModel.findById(userId);
        if (!existsUser) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exists`
            });
        }
        let isMemberExistsInGroup = false;
        for (let i = 0; i < existsGroup.members.length; i++) {
            if (existsGroup.members[i].toString() === userId) {
                isMemberExistsInGroup = true;
            }
        }
        if (isMemberExistsInGroup) {
            return res.status(400).json({
                success: false,
                message: 'User already in group'
            });
        }
        await UserModel.findByIdAndUpdate(userId, { $push: { groups: groupId } });
        await GroupModel.findByIdAndUpdate(groupId, { $inc: { gMemberNumber: 1 }, $push: { members: userId }, $pull: { pendingRequest: userId } });
        const data = {
            user: existsUser,
            group: existsGroup,
        };
        try {
            await sendMail({
                email: existsUser.email,
                subject: 'Accept Group Join Request',
                template: 'accept_invite_mail.ejs',
                data
            });
            return res.status(200).json({
                success: true,
                message: `Acceptation mail sent to ${existsUser.email}`,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Failed to send message',
                error
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const removeMember = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        if (userId == '' || groupId == '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }
        const existGroup = await GroupModel.findById(groupId);
        if (!existGroup) {
            return res.status(400).json({
                success: false,
                message: 'No such group exists'
            });
        }
        if (existGroup.leader.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: `You can't remove leader`
            })
        }
        const existUser = await UserModel.findById(userId);
        if (!existUser) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exists`
            });
        }
        let isMemberExistsInGroup = false;
        for (let i = 0; i < existGroup.members.length; i++) {
            if (existGroup.members[i].toString() === existUser.id) {
                isMemberExistsInGroup = true;
            }
        }
        if (!isMemberExistsInGroup) {
            return res.status(400).json({
                success: false,
                message: `User isn't in the group`
            });
        }
        await UserModel.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
        await GroupModel.findByIdAndUpdate(groupId, { $inc: { gMemberNumber: -1 }, $pull: { members: userId } });
        await ConversationModel.findOneAndUpdate({ group: groupId }, { $pull: { userIds: userId } });
        return res.status(200).json({
            success: true,
            message: 'User removed from the group successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const editGroupInfo = async (req, res) => {
    try {
        const { groupId, data } = req.body;
        if (!data || !groupId || groupId == '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }
        const existsGroup = await GroupModel.findById(groupId);
        if (!existsGroup) {
            return res.status(400).json({
                success: false,
                message: 'No group exists with this id'
            });
        }
        await GroupModel.findByIdAndUpdate(groupId, data);
        return res.status(200).json({
            success: true,
            message: 'Group updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        if (!groupId || groupId === '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }
        const existsGroup = await GroupModel.findById(groupId);
        if (!existsGroup) {
            return res.status(400).json({
                success: false,
                message: `Group doesn't exists`
            });
        }
        for (let i = 0; i < existsGroup.members.length; i++) {
            await UserModel.findByIdAndUpdate(existsGroup.members[i].toString(), { $pull: { groups: groupId } });
        }
        await GroupModel.findByIdAndDelete(groupId);
        const messages = await ConversationModel.findOneAndDelete({ group: groupId });
        for (let i = 0; i < messages.length; i++) {
            await MessageModel.findOneAndDelete({ conversationId: messages._id });
        }
        const posts = await TweetModel.find({ groupId: groupId });
        for (let i = 0; i < posts.length; i++) {
            await TweetModel.findByIdAndDelete(posts[i]._id);
        }
        return res.status(200).json({
            success: true,
            message: 'Group Deleted Successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getAllGroups = async (req, res) => {
    try {
        const groups = await GroupModel.find({}).select("-gMemberNumber -members");
        return res.status(200).json({
            success: true,
            message: 'All Groups fetched',
            groups
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getGroupInfo = async (req, res) => {
    try {
        const groupId = req.params.id;
        if (!groupId || groupId == '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields'
            });
        }
        const group = await GroupModel.findById(groupId).populate({ path: 'members', model: 'user', select: 'name email' });
        if (!group) {
            return res.status(400).json({
                success: false,
                message: `Group doesn't exists`
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Fetched whole group info',
            group
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



module.exports = {
    createGroup,
    joinRequest,
    inviteMember,
    editGroupInfo,
    joinGroup,
    addMember,
    removeMember,
    deleteGroup,
    getAllGroups,
    getGroupInfo,
};