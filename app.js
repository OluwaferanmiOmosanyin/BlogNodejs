const express = require('express');
const { default: mongoose } = require('mongoose');
const morgan =require('morgan');
const Blog = require('./models/blogSchema')

//express app
const app = express();
const db =
'mongodb+srv://omosanyinferanmi:feranmi4christ1@cluster0.uc4s0eq.mongodb.net/Node?retryWrites=true&w=majority';

mongoose.connect(db)
.then((result) =>{
    console.log('listen to port localhost:3000');
    app.listen(3000);
}).catch((err) => console.log(err));



app.set('view engine', 'ejs');

//rendering static files e.g css
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use((req, res, next)=>{
    console.log('host:', req.hostname);
    next();
})
app.use((req,res, next) =>{
console.log('morgan');
next();
})
app.use((req, res, next)=>{
  console.log(res.locals.path = res.paths);
  next();
})

///testing mongoose
app.get('/add-blog', (req,res)=> {
    const blog = new Blog({
        title: 'new blog 3',
        snippet: 'About new blog',
        body: 'More about new blog'
    })
    blog.save().then(result =>{
        res.send(result)
    })
    .catch(err =>{
        console.log(err)
    })
});

app.get('/all-blogs', (req,res) =>{
    Blog.find().then(result =>{
        res.send(result);
    }).catch(err =>{
        console.log(err);
    })
})
app.get('/single-blog', (req, res) =>{
    Blog.findById("65534c7d60e8e3a8f791a8f3")
    .then((result) => {
        res.send(result); 
    })
    .catch((err) => {
        console.log(err);
    });
})
///////-----------------/////
app.get('/', (req,res) =>{
    res.redirect('/blogs')
})

app.get('/about', (req, res) =>{
    res.render('about', {title: 'about'})
})
app.get('/blogs/create', (req,res) =>{
    res.render('create', {title: 'Create new blog'})
});
app.get('/blogs', (req,res) =>{
    Blog.find().then(result =>{
        res.render('homepage', {blogs: result,title: 'All blogs'})
    }).catch(err => {
        console.log(err);
    })
});

//middlewear for post request//
app.post("/blogs", (req, res) =>{
    console.log(req.body);
    const blog =  new Blog(req.body)
    blog.save().then(result =>{
        res.redirect('/blogs')
    }).catch(err =>{
        console.log(err);
    })
});
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id).then(result => {
        res.render('detail', {blog: result, title: 'Blog Detail'});
    }).catch(err => {
        console.log(err);
    });
});

app.delete('/blogs/:id', (req, res) =>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id).then(result => res.json({ redirect: '/blogs'})).catch(err => {
        console.log(err);
    })
})

//
app.use((req, res) =>{
    res.status(404).render('404', {title: ' Page not found'})
})