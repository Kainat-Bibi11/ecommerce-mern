import express from 'express';
import { loginUser, registerUser , logoutUser , requestPasswordReset, resetPassword, getUserDetails, updatePassword, updateProfile, getUsersList, getSingleUser ,updateUserRole, deleteUser} from '../controller/userController.js';
import { verifyUserAuth , roleBasedAccess} from '../middleware/userAuth.js';
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/password/forgot').post(requestPasswordReset);
router.route('/reset/:token').post(resetPassword);
router.route('/profile').post( verifyUserAuth, getUserDetails);
router.route('/password/update').post( verifyUserAuth, updatePassword);
router.route('/profile/update').post( verifyUserAuth, updateProfile);
router.route('/admin/users').get( verifyUserAuth,  roleBasedAccess("admin") , getUsersList);
router.route('/admin/user/:id')
.get( verifyUserAuth,  roleBasedAccess("admin") ,getSingleUser)
.put(verifyUserAuth,  roleBasedAccess("admin") ,updateUserRole)
.delete(verifyUserAuth,  roleBasedAccess("admin") ,deleteUser)

export default router;
