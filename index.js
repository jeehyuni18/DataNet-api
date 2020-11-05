require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors');
const bodyParser = require('body-parser')


const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, port: 3306, password: process.env.DB_PASS , user: process.env.DB_USER, connectionLimit: 5});

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/api/company', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT * FROM datanet.nodeTemp`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ rows })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.get('/api/companyName', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT * FROM datanet.companyName`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ rows })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.get('/api/company/link', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM datanet.link")
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ links:rows })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.get('/api/company/finance', (req, res) => {
    const { type } = req.query;
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT * FROM datanet.finance WHERE ${type} is not null`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ finances:rows })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})



app.post('/api/company', (req, res) => {
    const {data} = req.body
    let columns = '';
    Object.keys(data).forEach(key => {
        columns += `${key}='${data[key]}',`
    })
    columns= columns.substr(0, columns.length-1)
    pool.getConnection()
        .then(conn => {
            conn.query(`INSERT INTO datanet.nodeTemp SET ${columns}`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
            conn.query(`INSERT INTO datanet.companyName SET kedcd='${data['kedcd']}', companyName='${data['companyName']}',color='red'`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.delete('/api/company', (req, res) => {
    const { kedcd } = req.body;
    pool.getConnection()
        .then(conn => {
            conn.query(`DELETE FROM datanet.nodeTemp WHERE kedcd='${kedcd}'`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ message: "SUCCESS" })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.delete('/api/companyName', (req, res) => {
    const { kedcd } = req.body;
    pool.getConnection()
        .then(conn => {
            conn.query(`DELETE FROM datanet.companyName WHERE companyName='${kedcd}'`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ message: "SUCCESS" })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

app.get('/api/company/search', (req, res) => {
    const { companyName } = req.query;
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT * FROM datanet.nodeTemp WHERE companyName='${companyName}'`)
                .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
                    res.statusCode = 200
                    res.send({ rows })
                    conn.release();
                })
                .catch(err => {
                    console.log(err)
                    conn.release(); // release to pool
                })
        }).catch(err => {
        console.log(err)
    });
})

const server = http.createServer(app);
server.listen(3000,'0.0.0.0')

server.on('listening', () => {
    console.log(`Example app listening at`)
})

