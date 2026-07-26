'use strict';

module.exports = function(app){
    var jsonku = require('./controller');

    app.route('/api')
        .get(jsonku.index);

    app.route('/api/karyawan')
        .get(jsonku.tampilData)
        .post(jsonku.tambahData)
        
    app.route('/api/karyawan/:id')    
        .put(jsonku.ubahData)
        .delete(jsonku.hapusData)
        .get(jsonku.tampilDataById)
        
    app.route('/api/proyek')
        .get(jsonku.tampilangroupproyek);
}