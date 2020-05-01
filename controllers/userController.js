const UserModel = require('../models/userModel')
const mail = require('../confug/mail')
const jsonwebtoken = require('jsonwebtoken')
let codes = {}
function randomNum(min, max){
    var tmp = max - min + 1
    return parseInt(Math.random() * tmp) + min
}

exports.emailCode = async (req, res) => {
  const rule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  const {email, time} = req.body
  if (codes[email] && codes[email].cTime > time) {
    let ms = parseInt((codes[email].cTime - time) / 1000)
    res.send({code: -1, msg: '5分钟内不能重发',ms})
    return
  }
  const data = await UserModel.findOne({email})
  if (data) {
    //存在，不在允许注册
    res.send({code: -1, msg: "用户已注册"})
    return;
  }
  if (!email) {
    res.send({code: -1, msg:"邮箱不能为空"})
    return;
  }
  if (!rule.test(email)) {
    res.send({code: -1, msg:"请输入正确邮箱"})
    return;
  }

  let eCode = randomNum(100000, 999999)
  mail.send(email,eCode)
  console.log(eCode)
  
  let cTime = new Date().getTime() + 300000
  codes[email] = {eCode,cTime}
  
  res.send({code:0, msg:"发送成功",ms:300})
}

exports.register = async (req, res) => {
  //获取email
  const {email, eCode, time} = req.body
  const data  = await UserModel.findOne({email})
  if (!codes[email]) {
    res.send({code: -1, msg: "请发送验证码"})
    return
  }
  if (parseInt(time) > codes[email].cTime) {
    res.send({code: -1, msg: "验证码有效期已过"})
    return
  }
  if (parseInt(eCode) !== codes[email].eCode) {
    res.send({code: -1, msg: "验证码错误"})
    return
  }
  if (data) {
    res.send({code: -1, msg: "用户已注册"})
    return
  }
  await UserModel.create(req.body)
  res.send({code: 0, msg:"注册成功"})
}

exports.login = async (req, res) => {
  const {email,password} = req.body
  const data = await UserModel.findOne({email})
  if (!data || !data.comparePassword(password)) {
    res.send({code: -1, msg:"用户邮箱或密码不正确"})
    return
  }

  const token = jsonwebtoken.sign({
    userId:data._id
  }, "hao")
  res.send({code: 0, msg: "登录成功", token})
}

exports.getInfo = async (req, res) => {
  const {userId} = req.auth
  const data  = await UserModel.findOne({_id:userId},{password:0})
  res.send({code:0,msg:"成功",data})
}
