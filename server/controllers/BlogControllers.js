const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.filename;

    const newBlog = new Blog({
      title,
      content,
      image
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (req.file) {
      // Delete old image
      if (blog.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', blog.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      blog.image = req.file.filename;
    }

    blog.title = title;
    blog.content = content;
    blog.updatedAt = Date.now();

    await blog.save();
    res.json({ message: 'Blog updated', blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Delete image if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', blog.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
