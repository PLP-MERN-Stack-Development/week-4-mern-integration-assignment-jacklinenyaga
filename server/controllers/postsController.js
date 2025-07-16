const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate('author category', 'username name');
  res.status(200).json({ success: true, count: posts.length, data: posts });
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    'author category comments.user',
    'username name username'
  );

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: post });
});

exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this post`,
        401
      )
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this post`,
        401
      )
    );
  }

  await post.remove();

  res.status(200).json({ success: true, data: {} });
});

exports.addComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404)
    );
  }

  const comment = {
    user: req.user.id,
    content,
  };

  post.comments.push(comment);
  await post.save();

  res.status(200).json({ success: true, data: post.comments });
});