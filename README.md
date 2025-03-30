### Installation

1. Clone the repository
2. Install dependencies:
```
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the server:
```
npm start
```

For development with auto-restart:
```
npm run dev

# mern-csv-upload
The system enforces the following pricing rules:
1. Regular price cannot be lower than MAP
2. Sale price cannot be lower than MAP
3. If a price is set below MAP during import, it will be automatically adjusted to the MAP price 

## CSV Format

The CSV file should include the following columns:
- `product_id` (required): Unique identifier for the product
- `name` (required): Product name
- `description`: Product description
- `brand`: Brand name
- `size`: Tire size
- `model`: Tire model
- `category`: Product category
- `stock`: Quantity in stock
- `cost` (required): Cost price (not visible to frontend)
- `map` (required): Minimum Advertised Price (not visible to frontend)
- `price` (required): Regular selling price
- `sale_price`: Special sale price (optional)
