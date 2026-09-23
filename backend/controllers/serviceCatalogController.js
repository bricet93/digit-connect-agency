import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin d'accès au fichier categories.js côté Frontend
const CATEGORIES_FILE_PATH = path.join(__dirname, '../../frontend/constants/categories.js');

const syncCategoriesFile = async () => {
  const [rows] = await db.query('SELECT * FROM service_catalog ORDER BY display_order ASC, created_at ASC');
  
  const formattedCatalog = rows.map(item => ({
    id: item.id,
    group_fr: item.group_fr,
    group_en: item.group_en,
    name_fr: item.name_fr,
    name_en: item.name_en,
    price: Number(item.price)
  }));

  const fileContent = `export const SERVICES_CATALOG = ${JSON.stringify(formattedCatalog, null, 2)};\n\n` +
`export const getLocalizedServicesCatalog = (lang = 'fr') => {\n` +
`  const isEn = lang.startsWith('en');\n` +
`  return SERVICES_CATALOG.map(item => ({\n` +
`    id: item.id,\n` +
`    group: isEn ? item.group_en : item.group_fr,\n` +
`    name: isEn ? item.name_en : item.name_fr,\n` +
`    price: item.price\n` +
`  }));\n` +
`};\n`;

  fs.writeFileSync(CATEGORIES_FILE_PATH, fileContent, 'utf8');
};

export const getAllCatalogServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM service_catalog ORDER BY display_order ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET : Vérifier si un ID existe déjà (pour validation Frontend en temps réel)
export const checkIdExists = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id FROM service_catalog WHERE id = ?', [id]);
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST : Créer un nouveau service avec contrôle d'unicité
export const createCatalogService = async (req, res) => {
  const { id, group_fr, group_en, name_fr, name_en, price, display_order } = req.body;

  if (!id || !id.trim()) {
    return res.status(400).json({ success: false, message: "L'identifiant du service est requis." });
  }

  try {
    // 1. Contrôle d'existence préalable
    const [existing] = await db.query('SELECT id FROM service_catalog WHERE id = ?', [id.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: `L'identifiant "${id}" est déjà utilisé par un autre service.` 
      });
    }

    // 2. Insertion
    await db.query(
      `INSERT INTO service_catalog (id, group_fr, group_en, name_fr, name_en, price, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id.trim(), group_fr, group_en, name_fr, name_en, price, display_order || 0]
    );
    await syncCategoriesFile(); //[cite: 21]
    res.status(201).json({ success: true, message: 'Service créé et catalogue synchronisé !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCatalogService = async (req, res) => {
  const { id } = req.params;
  const { group_fr, group_en, name_fr, name_en, price, display_order } = req.body;
  try {
    await db.query(
      `UPDATE service_catalog 
       SET group_fr = ?, group_en = ?, name_fr = ?, name_en = ?, price = ?, display_order = ? 
       WHERE id = ?`,
      [group_fr, group_en, name_fr, name_en, price, display_order || 0, id]
    );
    await syncCategoriesFile();
    res.json({ success: true, message: 'Service mis à jour et categories.js synchronisé !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCatalogService = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM service_catalog WHERE id = ?', [id]);
    await syncCategoriesFile();
    res.json({ success: true, message: 'Service supprimé et categories.js synchronisé !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};