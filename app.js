const express = require('express')
const app = express()
const fetch = require('node-fetch')
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

app.post('/nodes/register', (req, res) => {
  const urls = req.body

  urls.forEach(url => {
    const node = new BlockchainNode(url)
    nodes.push(node)
    // res.send(`New node ${node} registered correctly!.`)
  })
  res.json(nodes)
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

app.get('/mine', (req, res) => {
  let block = blockchain.getNextBlock(transactions)
  blockchain.addBlock(block)

  // reset transactions, so the new block don't add the old ones.
  transactions = []
  res.json(block)
})

app.get('/resolve', (req, res) => {

  nodes.forEach(`${node.url}/blockchain`)
    .then(response => response.json)
    .then(otherBlockchain => {
      if(blockchain.blocks.length < otherBlockchain.blocks.length) {
        allTransactions.forEach(transaction => {
          fetch(`${node.url}/transactinos`, {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify(transaction)
          }).then( response => responde.json())
            .then( _ => {
              fetch(`${node.url}/mine`)
                .then(response => responde.json())
                .then(_ => {
                  fetch(`${node.url}/blockchain`)
                    .then(response => responde.json())
                    .then(updatedBlockchain => {
                      blockchain = updatedBlockchain
                    })
                })
            })
        })
      }
    })

})

app.listen(BLOCKCHAIN_NODE, () => {
  console.log(`Blockchain is running on PORT: ${BLOCKCHAIN_NODE}`)
})
