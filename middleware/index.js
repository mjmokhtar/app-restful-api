var express = require('express');
var auth = require('./auth');
var verifikasi = require('./verifikasi');
var router = express.Router();

//daftarkan menu 
router.post('/api/v1/register', auth.registrasi);
router.post('/api/v1/login', auth.login);

//alamat yang perlu di otorisasi
router.get('/api/v1/rahasia', verifikasi(), auth.halamanrahasia)

module.exports = router;