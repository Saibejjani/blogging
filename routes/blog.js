const { Router } = require('express');
const multer = require('multer');

const Blog = require('../models/blog');
const Comment = require('../models/comment');

const path = require('path');
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user: req.user,
  });
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    'createdBy'
  );

  return res.render('blog', {
    user: req.user,
    blog,
    comments,
  });
});

router.post('/', upload.single('coverImage'), async (req, res) => {
  const { body, title } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async (req, res) => {
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
