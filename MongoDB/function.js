require('../settings');
const { User } = require('./schema');

// Tambah user baru
async function addUser(username, email, password, apikey) {
    let obj = {
        username,
        email,
        password,
        apikey,
        defaultKey: apikey,
        limit: limitCount // pastikan limitCount ada di settings.js
    };
    await User.create(obj);
}
module.exports.addUser = addUser;

// Kurangi limit user
async function limitAdd(apikey) {
    let key = await User.findOne({ apikey });
    if (!key) return;
    let min = key.limit - 1;
    await User.updateOne({ apikey }, { limit: min });
}
module.exports.limitAdd = limitAdd;

// Cek email sudah dipakai atau belum
async function checkEmail(email) {
    let x = await User.findOne({ email });
    return x ? x.email : false;
}
module.exports.checkEmail = checkEmail;

// Cek username sudah dipakai atau belum
async function checkUsername(username) {
    let users = await User.findOne({ username });
    return users ? users.username : false;
}
module.exports.checkUsername = checkUsername;

// Cek apakah apikey valid
async function cekKey(apikey) {
    let db = await User.findOne({ apikey });
    return db ? db.apikey : false;
}
module.exports.cekKey = cekKey;

// Reset semua limit ke default
async function resetAllLimit() {
    let users = await User.find({});
    for (let data of users) {
        if (data.username) {
            await User.updateOne(
                { username: data.username },
                { limit: limitCount }
            );
        }
    }
}
module.exports.resetAllLimit = resetAllLimit;

// Cek apakah apikey sudah habis limitnya
async function isLimit(apikey) {
    let key = await User.findOne({ apikey });
    if (!key) return true; // kalau apikey nggak ada, dianggap limit habis
    return key.limit <= 0;
}
module.exports.isLimit = isLimit;

// Ambil sisa limit dari apikey
async function checkLimit(apikey) {
    let key = await User.findOne({ apikey });
    return key ? key.limit : 0;
}
module.exports.checkLimit = checkLimit;

// Ambil apikey user berdasarkan _id
async function getApikey(id) {
    let users = await User.findOne({ _id: id });
    if (!users) return null;
    return { apikey: users.apikey, username: users.username, limit: users.limit };
}
module.exports.getApikey = getApikey;