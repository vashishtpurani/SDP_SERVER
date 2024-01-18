const jwt = require("jsonwebtoken");
const {comModel} = require('../../Models/communityModels/comModel'); // Adjust the path based on your project structure
const mongoose = require('mongoose')
const repl = require("repl");
module.exports.createPost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const uId = decoded.id;

        const { query, Classified, content } = req.body;

        const newPost = new comModel({
            users: uId,
            query,
            Classified,
            Replies: [],
            upVote: [],
            downVote: [],
        });

        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.replyToPost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const uId = decoded.id;

        const { postId, content, parentReplyId } = req.body;

        const existingPost = await comModel.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newReply = {
            uId: new mongoose.Types.ObjectId(uId),
            content,
            _id: new mongoose.Types.ObjectId(),
            upVote: [],
            downVote: [],
            createDate: new Date(),
            Replies: [],
        }

        const addReplyToParent = (replies, parentReplyId) => {
            for (const reply of replies) {
                if (reply._id.toString() === parentReplyId.toString()) {
                    console.log(reply)
                    reply.Replies.push(newReply);
                    return true;
                }
                if (addReplyToParent(reply.Replies, parentReplyId)) {
                    return true;
                }
            }
            return false
        }

        if (parentReplyId) {
            const replyAdded = addReplyToParent(existingPost.Replies, parentReplyId)
            if (!replyAdded) {
                return res.status(404).json({ message: 'Parent reply not found' })
            }
        } else {
            existingPost.Replies.push(newReply)
        }

        const data = await existingPost.save()

        res.status(201).json({ message: 'Reply added successfully', reply: data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports.getAllPosts = async (req,res)=>{
    try{
        const data = await comModel.find()
        res.send({status:200,data:data})
    }catch(e){
        console.log(e)
    }
}

module.exports.getPost = async (req,res)=>{
    try{
        const id = req.params.id
        const data = await comModel.findById(id)
        if(data.length!==0){
            res.send({status:200,data:data})
        }
        res.send({status:404,message:"NOT FOUND"})
    }catch(e){
        console.log(e)
    }
}
