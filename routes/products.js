const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const processedResults = [];
        
        for (const row of results) {
          try {
            if (!row.product_id || !row.name || !row.cost || !row.map || !row.price) {
              errors.push({
                row,
                error: 'Missing required fields (product_id, name, cost, map, or price)'
              });
              continue;
            }
            const numericFields = ['cost', 'map', 'price', 'sale_price', 'stock'];
            for (const field of numericFields) {
              if (row[field]) row[field] = parseFloat(row[field]);
            }
            
            if (row.price < row.map) {
              row.price = row.map;
            }
            if (row.sale_price && row.sale_price < row.map) {
              row.sale_price = row.map;
            }
            
            const filter = { product_id: row.product_id };
            const update = {
              ...row,
              updated_at: new Date()
            };
            
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };
            const product = await Product.findOneAndUpdate(filter, update, options);
            
            processedResults.push(product);
          } catch (err) {
            errors.push({
              row,
              error: err.message
            });
          }
        }
        
        fs.unlinkSync(filePath);
        resolve({ processedResults, errors });
      })
      .on('error', (err) => {
        fs.unlinkSync(filePath);
        reject(err);
      });
  });
};

router.post('/upload', upload.single('products'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { processedResults, errors } = await processCSV(req.file.path);
    
    res.json({
      message: 'File processed successfully',
      processedCount: processedResults.length,
      errorCount: errors.length,
      errors
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}, { cost: 0, map: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne(
      { product_id: req.params.id }, 
      { cost: 0, map: 0 }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 