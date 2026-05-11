import express from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product.js';
import { verifyToken, requireSeller } from '../middleware/auth.js';

const router = express.Router();

// All inventory routes require auth + seller role
router.use(verifyToken, requireSeller);

// ──────────────────────────────────────────────
// GET /api/inventory
// List all products for the logged-in seller
// Query params: search, category, status, sortBy, order
// ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, category, sortBy = 'createdAt', order = 'DESC' } = req.query;

    const where = { sellerId: req.user.id };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku:  { [Op.like]: `%${search}%` } },
      ];
    }
    if (category && category !== 'All') {
      where.category = category;
    }

    const allowedSort = ['name', 'price', 'stock', 'sold', 'demand', 'createdAt'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const products = await Product.findAll({
      where,
      order: [[safeSort, safeOrder]],
    });

    // Compute virtual status for each row (VIRTUAL fields are included automatically)
    const data = products.map(p => ({
      ...p.toJSON(),
      status: p.status,
    }));

    res.json(data);
  } catch (err) {
    console.error('GET /inventory error:', err);
    res.status(500).json({ message: 'Failed to fetch inventory.' });
  }
});

// ──────────────────────────────────────────────
// POST /api/inventory
// Create a new product
// ──────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, sku, description, category, price, costPrice, stock, minStockThreshold, unit, imageUrl, demand } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'name, price, and stock are required.' });
    }

    const product = await Product.create({
      sellerId: req.user.id,
      name,
      sku: sku || null,
      description: description || null,
      category: category || 'Other',
      price: parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : 0,
      stock: parseInt(stock),
      minStockThreshold: minStockThreshold ? parseInt(minStockThreshold) : 5,
      unit: unit || 'pcs',
      imageUrl: imageUrl || null,
      demand: demand ? parseInt(demand) : 65,
      sold: 0,
      revenue: 0,
    });

    res.status(201).json({ ...product.toJSON(), status: product.status });
  } catch (err) {
    console.error('POST /inventory error:', err);
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// ──────────────────────────────────────────────
// PUT /api/inventory/:id
// Update a product (full update)
// ──────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.user.id } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const { name, sku, description, category, price, costPrice, stock, minStockThreshold, unit, imageUrl, demand } = req.body;

    await product.update({
      name:              name              ?? product.name,
      sku:               sku               ?? product.sku,
      description:       description       ?? product.description,
      category:          category          ?? product.category,
      price:             price !== undefined ? parseFloat(price) : product.price,
      costPrice:         costPrice !== undefined ? parseFloat(costPrice) : product.costPrice,
      stock:             stock !== undefined ? parseInt(stock) : product.stock,
      minStockThreshold: minStockThreshold !== undefined ? parseInt(minStockThreshold) : product.minStockThreshold,
      unit:              unit              ?? product.unit,
      imageUrl:          imageUrl          ?? product.imageUrl,
      demand:            demand !== undefined ? parseInt(demand) : product.demand,
    });

    res.json({ ...product.toJSON(), status: product.status });
  } catch (err) {
    console.error('PUT /inventory/:id error:', err);
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// ──────────────────────────────────────────────
// PATCH /api/inventory/:id/restock
// Quick restock — add quantity to existing stock
// Body: { quantity: number }
// ──────────────────────────────────────────────
router.patch('/:id/restock', async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.user.id } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const qty = parseInt(req.body.quantity);
    if (!qty || qty <= 0) return res.status(400).json({ message: 'Provide a positive quantity.' });

    await product.update({ stock: product.stock + qty });

    res.json({ ...product.toJSON(), status: product.status, addedQty: qty });
  } catch (err) {
    console.error('PATCH /inventory/:id/restock error:', err);
    res.status(500).json({ message: 'Failed to restock product.' });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/inventory/bulk
// Bulk delete products by IDs
// Body: { ids: number[] }
// ──────────────────────────────────────────────
router.delete('/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Provide an array of product IDs.' });
    }

    const deleted = await Product.destroy({
      where: { id: { [Op.in]: ids }, sellerId: req.user.id },
    });

    res.json({ message: `${deleted} product(s) deleted.`, deleted });
  } catch (err) {
    console.error('DELETE /inventory/bulk error:', err);
    res.status(500).json({ message: 'Failed to bulk delete products.' });
  }
});

// ──────────────────────────────────────────────
// DELETE /api/inventory/:id
// Delete a single product
// ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, sellerId: req.user.id } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('DELETE /inventory/:id error:', err);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

export default router;
