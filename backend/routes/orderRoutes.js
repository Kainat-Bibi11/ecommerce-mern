import express from 'express';
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from '../controller/orderController.js';
import { verifyUserAuth , roleBasedAccess } from '../middleware/userAuth.js';
const router = express.Router();

router.route('/new/order').post(verifyUserAuth , createNewOrder)
router.route('/admin/order/:id')
.get(verifyUserAuth ,roleBasedAccess('admin'), getSingleOrder)
.put(verifyUserAuth ,roleBasedAccess('admin'), updateOrderStatus)
.delete(verifyUserAuth ,roleBasedAccess('admin'), deleteOrder)
router.route('/admin/orders').get(verifyUserAuth ,roleBasedAccess('admin'), getAllOrders)
router.route('/orders/user').get(verifyUserAuth ,allMyOrders)

export default router 