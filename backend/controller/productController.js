import Product from '../models/productModel.js'
import handleError from "../utils/handleError.js";
import handleAsyncError from '../middleware/handleAsyncError.js';

// Creating Products 

export const createProducts = handleAsyncError(async (req, res, next) => {
        const product = await Product.create(req.body)
        res.status(201).json({ success: true, product })
    })

// Get All Products 

export const getAllProducts = handleAsyncError( async (req, res, next) => {
    const products = await Product.find()
    res.status(200).json({ success: true, products })
})

// Update Product

export const updateProduct = handleAsyncError (async (req, res,next) => {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!product) {
            return next(new handleError("Product not found" , 404))
        }
        res.status(200).json({ success: true, product })
    })

// Delete Product 

export const deleteProduct = handleAsyncError(async (req, res,next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new handleError("Product not found" , 404))
    }
    res.status(200).json({ success: true, message:"Product deleted successfully!" })
})

// Accessing Single Product 

export const getSingleProduct = handleAsyncError (async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new handleError("Product not found" , 404))
    }
    res.status(200).json({success:true,product})

})


