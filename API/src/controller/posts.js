const Post = require("../models/post");
const User = require("../models/user");
const PostLikes = require("../models/postLikes");
const Comment = require("../models/comment");
const CommentLikes = require("../models/commentLikes");
const NotFoundException = require("../exceptions/NotFoundException");

module.exports = {
  createPost: async (req, res) => {
    const post = new Post({
      User_ID: req.auth.User_ID,
      Title: req.body.Title,
      Text: req.body.Text,
      Visibility: req.body.Visibility,
      Image: req.file !== undefined ? req.file.filename : null,
    });
    await post.save().then(() => {
      res.send("Post inserting OK");
    });
  },
  getAllPosts: async (req, res) => {
    const postsOnPage = 10;
    let queryOffset;
    if (req.query.offset === "undefined" || req.query.offset === "") {
      queryOffset = 0;
    } else {
      queryOffset = req.query.offset;
    }
    await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["User_ID", "Username", "Image"],
        },
        {
          model: PostLikes,
          attributes: ["id"],
          include: {
            model: User,
            as: "Like_User",
            attributes: ["User_ID", "Username", "Image"],
          },
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["User_ID", "Username", "Image"],
            },
            {
              model: Comment,
              as: "Repl_to_Comment",
              attributes: ["Comment_ID", "Text", "created"],
              include: [
                {
                  model: User,
                  attributes: ["User_ID", "Username", "Image"],
                },
              ],
            },
            {
              model: CommentLikes,
              attributes: ["id"],
              include: {
                model: User,
                as: "Liked_by_User",
                attributes: ["User_ID", "Username", "Image"],
              },
            },
          ],
          order: [["created", "ASC"]],
        },
      ],
      order: [["Timestamp", "DESC"]],
      limit: postsOnPage,
      offset: queryOffset,
    }).then((data) => {
      if (data.length < postsOnPage) {
        return res.send({ data });
      }
      res.send({ data, nextOffset: parseInt(queryOffset) + postsOnPage });
    });
  },
  getPostsByUserId: async (req, res) => {
    const postsOnPage = 10;
    let queryOffset;
    if (req.query.offset === "undefined" || req.query.offset === "") {
      queryOffset = 0;
    } else {
      queryOffset = parseInt(req.query.offset);
    }
    await Post.findAll({
      where: { User_ID: req.params.id },
      include: [
        {
          model: User,
          attributes: ["User_ID", "Username", "Image"],
        },
        {
          model: PostLikes,
          attributes: ["id"],
          include: {
            model: User,
            as: "Like_User",
            attributes: ["User_ID", "Username", "Image"],
          },
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["User_ID", "Username", "Image"],
            },
            {
              model: Comment,
              as: "Repl_to_Comment",
              attributes: ["Comment_ID", "Text", "created"],
              include: [
                {
                  model: User,
                  attributes: ["User_ID", "Username", "Image"],
                },
              ],
            },
            {
              model: CommentLikes,
              attributes: ["id"],
              include: {
                model: User,
                as: "Liked_by_User",
                attributes: ["User_ID", "Username", "Image"],
              },
            },
          ],
          order: [["created", "ASC"]],
        },
      ],
      order: [["Timestamp", "DESC"]],
      limit: postsOnPage,
      offset: queryOffset,
    }).then((data) => {
      if (data.length < postsOnPage) {
        return res.send({ data });
      }
      res.send({ data, nextOffset: queryOffset + postsOnPage });
    });
  },
  getPostById: async (req, res) => {
    await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["Username", "Fullname", "Image"],
        },
        {
          model: PostLikes,
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "Like_User",
              attributes: ["Username", "Fullname", "Image"],
            },
          ],
        },
      ],
    }).then((data) => {
      if (data) {
        return res.send(data);
      }
      throw new NotFoundException("post not found");
    });
  },
  getPostBy: async (id) => {
    return await Post.findByPk(id).then((data) => {
      if (data) {
        return data.dataValues;
      }
      throw new NotFoundException("post not found");
    });
  },
  getPostImage: async (req, res) => {
    await Post.findByPk(req.params.id, {
      attributes: ["Image"],
    }).then((data) => {
      if (data === undefined) {
        res.send("Error");
        return;
      }
      if (data === null || !data.Image) {
        return res.send();
      }
      res.sendFile(data.Image, { root: "uploads/postImages" });
    });
  },
  updatePost: async (req, res) => {
    let data;
    if (req.file !== undefined) {
      data = {
        Title: req.body.Title,
        Text: req.body.Text,
        Visibility: req.body.Visibility,
        Image: req.file.filename,
      };
    } else {
      data = {
        Title: req.body.Title,
        Text: req.body.Text,
        Visibility: req.body.Visibility,
      };
    }
    await Post.update(data, {
      where: { Post_ID: req.params.id },
    }).then((success) => {
      if (success[0]) {
        res.send("Post updating OK");
      } else {
        throw new NotFoundException("Post does not exist");
      }
    });
  },
  deletePost: async (req, res) => {
    await Post.destroy({ where: { Post_ID: req.params.id } }).then(
      (success) => {
        if (success) {
          res.send("Post deleting OK");
        } else {
          throw new NotFoundException("Post does not exist");
        }
      }
    );
  },
  deletePostImage: async (req, res) => {
    await Post.update(
      { Image: null },
      { where: { Post_ID: req.params.id } }
    ).then((success) => {
      if (success[0]) {
        res.send("Image deleting OK");
      } else {
        throw new NotFoundException("Post does not exist");
      }
    });
  },
};
