const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  console.log("The data that comes in with the body to the /api/transaction/bulk route is the following: ",body)
  Transaction.insertMany(body)
    .then(dbTransaction => {
      console.log("Successfully inserted it into the Transaction colletion")
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log("There has been an error with inserting data into the transaction collection. This is the error: ",err)
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;