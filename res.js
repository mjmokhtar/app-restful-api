'use strict';

exports.ok = function(values, res){
    var data = {
        'status':200,
        'value': values
    };

    res.json(data);
    res.end();
}

//respon untuk nested proyek
exports.oknested = function(values, res){
    //lakukan akumulasi
    const hasil = values.reduce((akumulasikan, item)=>{
        //tentukan key grup
        if(akumulasikan[item.nama]){
            //buat variabel grup nama karyawan
            const grup = akumulasikan[item.nama];
            //cek isi array adalah proyek
            if(Array.isArray(grup.nama_proyek)){
                //tambahkan value ke dalam group matakuliah
                grup.nama_proyek.push(item.nama_proyek);
            }else{
                grup.nama_proyek = [grup.nama_proyek, item.nama_proyek];
            }
        }else{
            akumulasikan[item.nama] = item;
        }
        return akumulasikan;
    }, {});

    var data = {
        'status': 200,
        'values': hasil
    };

    res.json(data);
    res.end();
    
}