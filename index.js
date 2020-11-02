require('dotenv').config()
const express = require('express')
const app = express()
const port = 3020
const cors = require('cors');


const mariadb = require('mariadb');
const pool = mariadb.createPool({host: process.env.DB_HOST, port: 3306, password: process.env.DB_PASS , user: process.env.DB_USER, connectionLimit: 5});

app.use(cors());

app.get('/api/company', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM datanet.nodeTemp")
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

app.post('/api/company', (req, res) => {
    console.log(res.body);
    console.log(res);
    // pool.getConnection()
    //     .then(conn => {
    //         conn.query("SELECT * FROM datanet.link")
    //             .then(rows=>  { // rows: [ {val: 1}, meta: ... ]
    //                 res.statusCode = 200
    //                 res.send({ links:rows })
    //                 conn.release();
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 conn.release(); // release to pool
    //             })
    //     }).catch(err => {
    //     console.log(err)
    // });
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})