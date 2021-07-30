// config-lite配置文件，默认加载

module.exports = {
    mongodbUrl: 'mongodb://127.0.0.1/mall', // 默认27017端口
    imgTypeList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'], // 图片上传允许类型
    uploadDir: './public/upload/', // 上传目录
    tencentAddressKey: 'LONBZ-TTL33-B2F3T-YB37Q-A2AUJ-WPBZM', // 腾讯地图开发密钥key
    tencentSK: '94Td8seXgr31YXRYUrptfjGN8j9isS6', // 腾讯地图SK
};
