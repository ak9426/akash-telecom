import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', store: 'Akash Telecom', time: new Date().toISOString() });
  });

  // Products API
  app.get('/api/products', (req, res) => {
    try {
      let products = db.getProducts();
      const { category, brand, search, sort, featured, trending, newArrival, inStock } = req.query;

      if (category && category !== 'all') {
        products = products.filter(
          (p) => p.categoryId === category || p.slug === category || p.categoryName.toLowerCase() === String(category).toLowerCase()
        );
      }

      if (brand && brand !== 'all') {
        products = products.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
      }

      if (search) {
        const q = String(search).toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }

      if (featured === 'true') {
        products = products.filter((p) => p.isFeatured);
      }

      if (trending === 'true') {
        products = products.filter((p) => p.isTrending);
      }

      if (newArrival === 'true') {
        products = products.filter((p) => p.isNewArrival);
      }

      if (inStock === 'true') {
        products = products.filter((p) => p.stock > 0);
      }

      // Sorting
      if (sort === 'price-asc') {
        products.sort((a, b) => a.discountedPrice - b.discountedPrice);
      } else if (sort === 'price-desc') {
        products.sort((a, b) => b.discountedPrice - a.discountedPrice);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'discount') {
        products.sort((a, b) => b.discountPercentage - a.discountPercentage);
      } else {
        // default / popularity
        products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      }

      res.json(products);
    } catch (err) {
      console.error('[API] Error getting products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    try {
      const created = db.createProduct(req.body);
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });

  // Categories API
  app.get('/api/categories', (_req, res) => {
    res.json(db.getCategories());
  });

  app.post('/api/categories', (req, res) => {
    const cat = db.createCategory(req.body);
    res.status(201).json(cat);
  });

  app.put('/api/categories/:id', (req, res) => {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const success = db.deleteCategory(req.params.id);
    if (!success) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  });

  // Orders API
  app.get('/api/orders', (req, res) => {
    const { status, payment } = req.query;
    let orders = db.getOrders();
    if (status) {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === String(status).toLowerCase());
    }
    if (payment) {
      orders = orders.filter((o) => o.paymentStatus === payment);
    }
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    try {
      const order = db.createOrder(req.body);
      res.status(201).json(order);
    } catch (err) {
      console.error('[API] Order creation error:', err);
      res.status(400).json({ error: 'Failed to process order' });
    }
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  // Order tracking endpoint (lookup by order ID & phone)
  app.get('/api/track', (req, res) => {
    const { orderId, phone } = req.query;
    if (!orderId && !phone) {
      return res.status(400).json({ error: 'Please provide Order ID or Phone number' });
    }

    if (orderId) {
      const order = db.getOrderById(String(orderId));
      if (order) {
        // If phone also provided, verify match
        if (phone) {
          const clean1 = order.phone.replace(/\D/g, '');
          const clean2 = String(phone).replace(/\D/g, '');
          if (!clean1.endsWith(clean2) && !clean2.endsWith(clean1)) {
            return res.status(404).json({ error: 'Order ID does not match phone number' });
          }
        }
        return res.json([order]);
      }
    }

    if (phone) {
      const orders = db.getOrdersByPhone(String(phone));
      if (orders.length > 0) {
        return res.json(orders);
      }
    }

    return res.status(404).json({ error: 'No matching order found. Please check details.' });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status, courierService, courierTrackingCode } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, {
      service: courierService,
      tracking: courierTrackingCode,
    });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  });

  app.patch('/api/orders/:id/payment', (req, res) => {
    const { paymentStatus, transactionId } = req.body;
    const updated = db.updatePaymentStatus(req.params.id, paymentStatus, transactionId);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  });

  // Coupons API
  app.get('/api/coupons', (_req, res) => {
    res.json(db.getCoupons());
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });
    const result = db.validateCoupon(code, Number(subtotal) || 0);
    res.json(result);
  });

  app.post('/api/coupons', (req, res) => {
    const coupon = db.addCoupon(req.body);
    res.status(201).json(coupon);
  });

  app.delete('/api/coupons/:code', (req, res) => {
    const ok = db.deleteCoupon(req.params.code);
    if (!ok) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  });

  // Reviews API
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    res.json(db.getReviews(productId ? String(productId) : undefined));
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const review = db.addReview(req.body);
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: 'Failed to submit review' });
    }
  });

  // Settings API
  app.get('/api/settings', (_req, res) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Admin Stats
  app.get('/api/stats', (_req, res) => {
    res.json(db.getStats());
  });

  // Admin Auth endpoint
  app.post('/api/admin/login', (req, res) => {
    const { pin } = req.body;
    // Default admin PIN for Akash Telecom store owner
    if (pin === '01864' || pin === 'admin123' || pin === 'akash2026') {
      return res.json({
        success: true,
        user: { name: 'Akash Khan', role: 'Store Owner / Admin', email: 'khanakash9426@gmail.com' },
        token: `adm_${Date.now()}`,
      });
    }
    return res.status(401).json({ error: 'Incorrect Admin PIN or password' });
  });

  // --- Serve Frontend ---
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Akash Telecom] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
