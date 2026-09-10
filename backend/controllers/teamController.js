import pool from '../config/db.js';

// Ajouter un membre d'équipe
export const createTeamMember = async (req, res) => {
  try {
    const { full_name, role_fr, role_en, email, phone, photo_url, social_link, is_active, display_order } = req.body;

    const [result] = await pool.query(
      `INSERT INTO team_members 
       (full_name, role_fr, role_en, email, phone, photo_url, social_link, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name, 
        role_fr, 
        role_en || null, 
        email || null, 
        phone || null, 
        photo_url || null, 
        social_link || null, 
        is_active || 1, 
        display_order || 0
      ]
    );

    res.status(201).json({ success: true, message: 'Membre ajouté avec succès', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer tous les membres de l'équipe
export const getTeam = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team_members ORDER BY display_order ASC, created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Modifier un membre d'équipe
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, role_fr, role_en, email, phone, photo_url, social_link, is_active, display_order } = req.body;

    await pool.query(
      `UPDATE team_members 
       SET full_name=?, role_fr=?, role_en=?, email=?, phone=?, photo_url=?, social_link=?, is_active=?, display_order=?
       WHERE id=?`,
      [
        full_name, 
        role_fr, 
        role_en || null, 
        email || null, 
        phone || null, 
        photo_url || null, 
        social_link || null, 
        is_active || 1, 
        display_order || 0, 
        id
      ]
    );

    res.json({ success: true, message: 'Membre mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer un membre d'équipe
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
    res.json({ success: true, message: 'Membre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};