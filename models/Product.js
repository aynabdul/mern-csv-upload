const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  brand: String,
  size: String,
  model: String,
  category: String,
  images: [String],
  stock: { type: Number, default: 0 },
  cost: { type: Number, required: true },       
  map: { type: Number, required: true },        
  price: { type: Number, required: true },      
  sale_price: Number,                          
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

productSchema.pre('save', function(next) {
  if (this.price < this.map) {
    this.price = this.map;
  }
  if (this.sale_price && this.sale_price < this.map) {
    this.sale_price = this.map;
  }
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema); 