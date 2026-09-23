import pool from '../config/db.js';

export const createContact = async (req, res) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;

    if (!full_name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez remplir les champs obligatoires (Nom, Email, Message).' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO contacts (full_name, email, phone, subject, message) 
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, phone || null, subject || null, message]
    );

    return res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès !'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};