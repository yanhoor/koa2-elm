const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('config-lite')(__dirname);

mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(config.mongodbUrl);

// connect() 返回一个状态待定（pending）的连接，可以用来判断连接成功或失败
const db = mongoose.connection;

db.once('open', function() {
    console.log(chalk.green('mongoose 连接成功！' + config.mongodbUrl));
});

db.on('error', (e) => {
    console.error(chalk.red('mongoose 连接出错----->' + e));
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(chalk.red('mongoose 断开，重新连接数据库'));
    mongoose.connect(config.mongodbUrl);
});

module.exports = db;
