const express = require('express')
const {register, login, emailCode, getInfo} = require('../controllers/userController')
const router = express.Router()
const auth = require('../middlewares/auth')


/**  
 * @api {post} http://localhost:3000/pnext/register 注册
 * @apiGroup user
 *
 * @apiParam {String} email 用户邮箱
 * @apiParam {String} password  用户密码
 * @apiParam {String} eCode 邮箱验证码 \
 * @apiParam {String} time 时间戳
 * 
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
*/

router.post('/register', register)


/**  
 * @api {post} http://localhost:3000/pnext/emailCode 邮箱验证码
 * @apiGroup user
 *
 * @apiParam {String} email 用户邮箱
 *  @apiParam {String} time 时间戳
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
*/

router.post('/emailCode',emailCode)

/**  
 * @api {post} http://localhost:3000/pnext/login 登录 
 * @apiGroup user
 *
 * @apiParam {String} email 用户邮箱
 * @apiParam {String} password  用户密码
 *
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {String} token token
*/
router.post('/login',login)

/**  
 * @api {get} http://localhost:3000/pnext/getInfo 获取当前登录用户的基本信息
 * @apiGroup user
 *
 *
 * @apiParam (Headers) {String} Authorization token
 * @apiSuccess {Number} code  错误状态码
 * @apiSuccess {String} msg 错误消息
 * @apiSuccess {Object} data 当前用户的基本信息
*/

router.get('/getInfo', auth, getInfo)

module.exports = router
