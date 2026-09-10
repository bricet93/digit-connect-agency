import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import quoteRoutes from './routes/quoteRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js'
import teamRoutes from './routes/teamRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceCatalogRoutes from './routes/serviceCatalogRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', agency: 'DIGIT-CONNECT AGENCY', slogan: "De l'idée à l'impact" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur DIGIT-CONNECT démarré sur http://localhost:${PORT}`);
});

app.use('/api/quotes', quoteRoutes);

app.use('/api/contacts', contactRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/articles', articleRoutes);

app.use('/api/portfolio', portfolioRoutes);

app.use('/api/team', teamRoutes);

app.use('/api/services', serviceRoutes);

app.use('/api/service-catalog', serviceCatalogRoutes);