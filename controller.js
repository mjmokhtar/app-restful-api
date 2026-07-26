'use strict';

var response = require('./res');
var connection = require('./koneksi');

exports.index = function(req,res){
    response.ok("Aplikasi REST API berjalan", res)
};

//menampilkan semua data karyawan
exports.tampilData = function(req,res){
    connection.query('SELECT * FROM karyawan', function (err, rows, fileds){
        if(err){
            console.log(err)
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }else{
            response.ok(rows,res);
        }
    });
};

//menampilkan semua data karyawan
exports.tampilDataById = function(req,res){
    let id = req.params.id;
    connection.query('SELECT * FROM karyawan WHERE id_karyawan = ?', [id], 
    function (err, rows, fileds){
        if(err){
            console.log(err)
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }else{
            response.ok(rows,res);
        }
    });
};

//menambahkan data karyawan
exports.tambahData = function(req,res){
    var nik = req.body.nik;
    var nama = req.body.nama;
    var posisi = req.body.posisi;
    
    connection.query('INSERT INTO karyawan (nik,nama,posisi) VALUES(?,?,?)',
    [nik, nama, posisi],
    function(err, rows, fields){
        if(err){
            console.log(err)
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }else{
            response.ok(rows,res);
        }
    });
};

exports.ubahData = function(req, res) {
    var id = req.params.id;
    let formData = {
        nik: req.body.nik,
        nama: req.body.nama,
        posisi: req.body.posisi
    };

    connection.query('UPDATE karyawan SET ? WHERE id_karyawan = ?', [formData, id],
        function(err) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error',
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Update Data Successfully!'
                });
            }
        });
};


//menghapus data berdasarkan id
exports.hapusData = function(req,res){
    var id = req.params.id;
        
    connection.query('DELETE FROM karyawan WHERE karyawan.id_karyawan = ?', [id], 
    function(err){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    });
};

//menampilkan data proyek grup
exports.tampilangroupproyek = function(req,res){
    connection.query('SELECT karyawan.id_karyawan, karyawan.nik, karyawan.nama, karyawan.posisi, proyek.nama_proyek, proyek.anggaran FROM vendor JOIN proyek JOIN karyawan WHERE vendor.id_proyek = proyek.id_proyek AND vendor.id_karyawan = karyawan.id_karyawan ORDER BY karyawan.id_karyawan',
        function (err, rows, fields){
            if (err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error',
                })
            }else {
                response.oknested(rows, res);
            }
        }
    )
}