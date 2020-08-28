var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (pool) => {

  router.get('/', function (req, res, next) {
    pool.query('SELECT * FROM test ORDER BY id ASC ', (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rows)
    })
  });

  router.post('/', function (req, res, next) {
    pool.query('INSERT INTO test (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, req.body.boolean], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data)
    })
  });

  router.put('/:id', function (req, res, next) {
    pool.query('UPDATE test SET string=$1, integer=$2, float=$3, date=$4, boolean=$5 WHERE id=$6', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, req.body.boolean, Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data)
    })
  });

  router.delete('/:id', function (req, res, next) {
    pool.query('DELETE FROM test WHERE id=$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data)
    })
  });

  return router;
}