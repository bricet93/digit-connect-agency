import pool from '../config/db.js';

export const getPortfolio = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer tous les éléments du portfolio pour le dashboard admin
export const getAllAdminPortfolio = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("Erreur récupération portfolio admin :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération du portfolio"
    });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    const { title_fr, title_en, category, client_name, image_url, project_url, description_fr, description_en } = req.body;
    const [result] = await pool.query(
      `INSERT INTO portfolio (title_fr, title_en, category, client_name, image_url, project_url, description_fr, description_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_fr, title_en, category, client_name || null, image_url, project_url || null, description_fr || null, description_en || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_fr, title_en, category, client_name, image_url, project_url, description_fr, description_en } = req.body;
    await pool.query(
      `UPDATE portfolio SET title_fr=?, title_en=?, category=?, client_name=?, image_url=?, project_url=?, description_fr=?, description_en=? WHERE id=?`,
      [title_fr, title_en, category, client_name || null, image_url, project_url || null, description_fr || null, description_en || null, id]
    );
    res.json({ success: true, message: 'Projet mis à jour' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM portfolio WHERE id = ?', [id]);
    res.json({ success: true, message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};