const express = require('express');
const app = express();
const morgan = require('morgan');
const Comment = require('./models/comment');

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/comments', async (req,res) => {
    const cmnts = await Comment.find();
    res.send(cmnts);
});

app.post('/api/comments', async (req,res) => {
    const cmnt = new Comment({
        username:req.body.username,
        comment:req.body.comment
    });
    const record = await cmnt.save();
    res.send(record);
});

module.exports = app;
