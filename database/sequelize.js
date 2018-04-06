var lib = require('sql.js');
lib.verbose = function() {
    return lib;
}

lib._Database = lib.Database;
lib.Database = class Db extends lib._Database {
    constructor(filename, mode, cb) {
        super();
        process.nextTick(cb, null);
    }

    //I'm not 100% sure what this was supposed to do on node-sqlite3, heh.
    serialize(cb) {
        process.nextTick(cb);
    }

    run(sql, params, cb) {
        super.run(sql, params);
        var ctx = {};
        if (sql.toLowerCase().indexOf('insert') !== -1) {
            var rez = this.exec("select last_insert_rowid();");
            ctx.lastID = rez[0].values[0][0];
        }
        if (cb) {
            process.nextTick(cb.bind(ctx), null);
        }
        return this;
    }

    all(sql, params, cb) {
        var result = [];
        this.each(sql, params,
            function(r) {
                result.push(r);
            },
            function() {
                cb(null, result);
            });
        return this;
    }

    close () {

    }
}

import Sequelize from 'sequelize';
import electron from 'electron';
import path from 'path';

const sequelize = new Sequelize('db', 'username', 'password', {
    dialect: 'sqlite',
    dialectModulePath: 'sql.js',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: path.join(electron.app.getPath('userData'), 'db.sqlite')
});

sequelize.sync({
    force: true
});

export default sequelize;