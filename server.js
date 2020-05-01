//引入 express
const express = require('express')

require('dotenv').config()
require('express-async-errors')
//引入抽离出去的路由文件
const userRouter = require('./routers/userRouter')

const app = express()

//req.body 中间件处理
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type"
  })
  next()
})

//静态资源托管处理
app.use(express.static('./public'))

//调用路由文件，并设置好前缀
app.use('/pnext', userRouter)

//统一错误处理
app.use((err, req, res, next) => {
  console.log(err)
  res.status(401).send(err.message)
})


//监听端口，启动服务
app.listen(3000, ()=>{
  console.log('服务器启动成功')
})
