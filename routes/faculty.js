const AdminBro1 = require('admin-bro')
const AdminBroExpress1 = require('admin-bro-expressjs')
const AdminBroMongoose1 = require('admin-bro-mongoose')
const mongoose1 = require('mongoose')


const Courses = require('../models/dishes')


AdminBro1.registerAdapter(AdminBroMongoose1)


const adminBro1 = new AdminBro1({
    
  resources: [Courses],
  rootPath: '/faculty'
})


const router1 = AdminBroExpress1.buildRouter(adminBro1)

module.exports= router1