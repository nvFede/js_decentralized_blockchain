const express = require('express')
const app = express()

const args = process.argv

let BLOCKCHAIN_NODE = 8080

if (args > 2) {
  BLOCKCHAIN_NODE = args[2]
}

const Block = require('./js/block')
const Blockchain = require('./js/blockchain')
const Transaction = require('./js/transaction')
const BlockchainNode = require('./js/blockchainNode')

let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)
let transactions = []
let nodes = []

app.use(express.json())

app.post('nodes/register', (req, res) => {
  const urls = body.req

  urls.forEach(url => {
    const node = new BlockchainNode(url)
    nodes.push(node)
  })
  res.json(nodes)
  res.send('New node registered correctly!.')
})

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
