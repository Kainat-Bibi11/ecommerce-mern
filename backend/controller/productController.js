import Product from '../models/productModel.js'
import handleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';
import APIFunctionality from '../utils/apiFunctionality.js';


// Creating Products 

export const createProducts = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
})

// Get All Products 

export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 3;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    // Getting filtered query before pegination 

    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    //    Calculate total pages based on filtered count 

    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if(page>totalPages && productCount>0){
        return next(new handleError("This page doesn't exist" , 404))
    }

    // Apply peination 

    apiFeatures.pagination(resultPerPage);
   // const products = await Product.find()
    const products = await apiFeatures.query;
    if(!products || products.length===0){
        return next(new handleError("no product found", 404))
    }
    res.status(200).json({ success: true, products, productCount, totalPages, resultPerPage, currentPage:page})
})

// Update Product

export const updateProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!product) {
        return next(new handleError("Product not found", 404))
    }
    res.status(200).json({ success: true, product })
})

// Delete Product 

export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new handleError("Product not found", 404))
    }
    res.status(200).json({ success: true, message: "Product deleted successfully!" })
})

// Accessing Single Product 

export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new handleError("Product not found", 404))
    }
    res.status(200).json({ success: true, product })

})

// Creating and Updating Review 

export const createOrUpdateReviewForProduct = handleAsyncError(async (req, res, next) => {
  const {rating , comment , productId} = req.body;
  const review = {
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }
  const product = await Product.findById(productId);
  const reviewExist = product.reviews.find(review=>review.user.toString()===req.user.id.toString())
  if(reviewExist){
    product.reviews.forEach(review=>{
        if(review.user.toString()===req.user.id.toString()){
            review.rating = rating,
            review.comment = comment
        }
    })
  }else{
   product.reviews.push(review);
  }

 product.numOfReviews = product.reviews.length

  let sum = 0;
  product.reviews.forEach(review=>{
    sum+=review.rating 
  })

//   If we are not having any rating and if we are find the length of the array here we have zero and any number divided by zero we are going to have the error 

// before calculating we are just going to check the condition 

  product.ratings =product.reviews.length>0?sum/product.reviews.length:0

  await product.save({validateBeforeSave:false})
  res.status(200).json({
    success:true,
    product
  })
})

// Admin Getting All Products 

export const getAdminProducts = handleAsyncError(async(req,res,next)=>{
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products
    })
})


