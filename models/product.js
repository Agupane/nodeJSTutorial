const fs = require('fs')
const path = require('path')

const products = [];

const getProductsFromFile = (callback) => {
    const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
    fs.readFile(p, (err, fileContent) =>{
        if(err){
            callback([])
        } else {
            callback(JSON.parse(fileContent))
        }
    })
}

module.exports = class Product {
    constructor(title) {
        this.title = title
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (error) =>{
                console.log("error ", error)
            })
        })
    }

    static fetchAll(callback) {
        getProductsFromFile(callback)
    }
}