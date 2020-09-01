var express = require('express');
const {
  json
} = require('express');
const {
  off
} = require('../app');
var router = express.Router();

module.exports = function (pool) {

  router.get('/', function (req, res, next) {

    let params = [];
    let search = false;

    if (req.query.cekId && req.query.id) {
      params.push(`id = ${req.query.id}`);
      search = true;
    }

    if (req.query.cekString && req.query.string) {
      params.push(`string like '%${req.query.string}%'`);
      search = true;
    }

    if (req.query.cekInteger && req.query.integer) {
      params.push(`integer = '${req.query.integer}'`);
      search = true;
    }

    if (req.query.cekFloat && req.query.float) {
      params.push(`float = '${req.query.float}'`);
      search = true;
    }

    if (req.query.cekDate && req.query.startDate && req.query.endDate) {
      params.push(`date BETWEEN '${req.query.startDate}' AND '${req.query.endDate}'`);
      search = true;
    }

    if (req.query.checkBoolean && req.query.boolean) {
      params.push(`boolean = '${req.query.boolean}'`);
      search = true;
    }
    
    
    let dataSearch = ""
    if (search) {
      dataSearch += `WHERE ${params.join(' AND ')}`
    }

    console.log(params)
    console.log('test', dataSearch);

    const page = Number(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    let sql = `SELECT COUNT(id) AS total FROM test ${dataSearch}`
    pool.query(sql, (err, data) => {
      if (err) {
        return res.json(err);
      } else if (data.rows == 0) {
        return res.send('Sorry, data not found')
      } else {
        const total = Number(data.rows[0].total);
        const pages = Math.ceil(total / limit);

        let sql = `SELECT * FROM test ${dataSearch} ORDER BY id LIMIT $1 OFFSET $2`
        pool.query(sql, [limit, offset], (err, data) => {
          if (err) {
            return res.send(err);
          } else if (data.rows == 0) {
            return res.send('Sorry, data not found')
          } else
            res.json({ data: data.rows, page, pages });

        })

      }
    })

  });

  router.post('/', function (req, res, next) {
    pool.query('INSERT INTO test (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, JSON.parse(req.body.boolean)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rows)
    })
  });

  router.get('/:id', function (req, res, next) {
    pool.query('SELECT * FROM test WHERE id=$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.json(err)
      res.json(data.rows)
    })
  });

  router.put('/:id', function (req, res, next) {
    pool.query('UPDATE test SET string=$1, integer=$2, float=$3, date=$4, boolean=$5 WHERE id=$6', [req.body.string, Number(req.body.integer), parseFloat(req.body.float), req.body.date, JSON.parse(req.body.boolean), Number(req.params.id)], (err, data) => {
      if (err) return res.json(err)
      res.json(data.rows)
    })
  });

  router.delete('/:id', function (req, res, next) {
    pool.query('DELETE FROM test WHERE id=$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.json(err)
      res.json(data.rows)
    })
  });

  return router;
}