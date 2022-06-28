const express = require('express')
const app = express()

const args = process.argv

let BLOCKCHAIN_NODE = 8080

if (args > 2) {
  BLOCKCHAIN_NODE = args[2]
}

const Block = require('./block')
const Blockchain = require('./blockchain')
const Transaction = require('./transaction')

let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)
let transactions = []


app.use(express.json())

app.post('/transactions', (req, res) => {
  const to = req.body.to
  const from = req.body.from
  const amount = req.body.amount

  let transaction = new Transaction(from, to, amount)
  transactions.push(transaction)
  res.json(transactions)
})

app.get('/blockchain', (req, res) => {
  res.json(blockchain)
})

app.get('/mining', (req, res) => {
  let block = blockchain.getNextBlock(transactions)
  blockchain.addBlock(block)
  res.json(block)
})

app.listen(BLOCKCHAIN_NODE, () => {
  console.log(`Blockchain is running on PORT: ${BLOCKCHAIN_NODE}`)
})
