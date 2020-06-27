const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose')

require('../models/user')
require('../models/promotions')
require('../models/leaders')
require('../models/favorite')
require('../models/dishes')
require('../models/comments')
require('../models/urls')

AdminBro.registerAdapter(AdminBroMongoose)


const adminBro = new AdminBro({
    
  databases: [mongoose],
  rootPath: '/admin',
})


const router = AdminBroExpress.buildRouter(adminBro)

module.exports= router
