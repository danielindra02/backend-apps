//initials dependencies & Moduls
const port = 4000;//define our port on server running
const express = require("express");//package name "express"
const app = express();//create app using express
const mongoose = require("mongoose");//initials mongoo package
const jwt = require("jsonwebtoken");//initials json web token
const multer = require("multer");//initials multer
const path = require("path"); //include path express server to access backend apps
const cors = require("cors");
// const { error } = require("console");

app.use(express.json());//app auto pass the json
app.use(cors());//react.js connect to port

//Database connection with mongoDB
mongoose.connect("mongodb+srv://danielindra:daniel.123@cluster0.bw63tiu.mongodb.net/e-commerce")

//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// image storage engine

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req, file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})


//Creating API For deleting Products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("remove");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creating API For getting all Products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All Product Fetched");
    res.send(products);
})

app.listen(port,(error)=>{
    if(!error){
    console.log("Server Running on Port "+port);
    }
    else{
        console.log("Error : "+error) 
    }
})
 

