const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

const mongoose = require('mongoose');
require('../models/user')
require('../models/faculties')
require('../models/enroll')
require('../models/courses')
require('../models/comments')
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose], 
  rootPath: '/admin',
  branding: {
    companyName: 'Course-S',
  },
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@swathi.com',
  password: process.env.ADMIN_PASSWORD || 'admin',
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'some-super-sensitive-password',
    authenticate: async (email, password) => {
    if (ADMIN.password === password && ADMIN.email === email) {
      return ADMIN
    }
    return null

    }
});


module.exports = router;