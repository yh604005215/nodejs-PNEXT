const jsonwebtoken = require('jsonwebtoken')
module.exports = (req, res, next) => {
  //获取请求头中的Authorization 得到的值是token
  const token = req.get('Authorization')
  //判断token是否存在
  if(token) {
    //存在,然后校验token
    jsonwebtoken.verify(token, 'hao', async (err,data) => {
      if(err) {   
        //校验失败
        res.status(401).send('身份校验失败')
      } else{
        //校验成功
        req.auth = data
        next()
      }
    })
  }else {
     //不存在
    res.status(401).send('请携带token')
  }
    
}
