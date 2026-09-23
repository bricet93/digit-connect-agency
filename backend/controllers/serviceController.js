import pool from '../config/db.js';

export const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY id ASC');
    const formattedData = rows.map(item => ({
      ...item,
      category: typeof item.category === 'string' ? JSON.parse(item.category) : item.category
    }));
    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { category, title_fr, title_en, description_fr, description_en, is_active } = req.body;
    const categoryJson = JSON.stringify(Array.isArray(category) ? category : [category]);

    const [result] = await pool.query(
      `INSERT INTO services (category, title_fr, title_en, description_fr, description_en, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        categoryJson,
        title_fr,
        title_en || title_fr,
        description_fr || null,
        description_en || null,
        is_active !== undefined ? is_active : 1
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title_fr, title_en, description_fr, description_en, is_active } = req.body;
    const categoryJson = JSON.stringify(Array.isArray(category) ? category : [category]);

    await pool.query(
      `UPDATE services 
       SET category=?, title_fr=?, title_en=?, description_fr=?, description_en=?, is_active=?
       WHERE id=?`,
      [
        categoryJson,
        title_fr,
        title_en,
        description_fr || null,
        description_en || null,
        is_active,
        id
      ]
    );
    res.json({ success: true, message: 'Service mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};