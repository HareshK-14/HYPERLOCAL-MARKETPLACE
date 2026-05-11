import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('Groceries', 'Electronics', 'Clothing', 'Pharmacy', 'Bakery', 'Other'),
    defaultValue: 'Other',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  minStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'pcs',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.VIRTUAL,
    get() {
      const stock = this.getDataValue('stock');
      const threshold = this.getDataValue('minStockThreshold');
      if (stock === 0) return 'Out of Stock';
      if (stock <= threshold) return 'Low Stock';
      return 'In Stock';
    },
  },
  sold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  revenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
  },
  demand: {
    type: DataTypes.INTEGER,
    defaultValue: 65,
    comment: 'AI demand score 0-100',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

// Associations
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });

export default Product;
