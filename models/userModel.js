const mongoose = require('../confug//db')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    requored: true,
    validate: {
      validator (val) {
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)
      },
      message: "请输入正确的邮箱"
    }
  },
  password: {
    type: String,
    required: true
  }
},{
  timestamps: true
})

userSchema.pre('save', function (next) {
  this.password = bcryptjs.hashSync(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function (password) {
  return bcryptjs.compareSync(password, this.password)
}

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel
