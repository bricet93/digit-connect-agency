import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Comptage direct des tables
    const [[quotesRes]] = await pool.query('SELECT COUNT(*) AS total FROM quotes');
    const [[contactsRes]] = await pool.query('SELECT COUNT(*) AS total FROM contacts');
    const [[articlesRes]] = await pool.query('SELECT COUNT(*) AS total FROM articles');

    // Récupération des données récents
    const [recentQuotes] = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 5');
    const [recentContacts] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5');

    return res.json({
      success: true,
      data: {
        stats: {
          quotesCount: Number(quotesRes?.total || 0),
          contactsCount: Number(contactsRes?.total || 0),
          articlesCount: Number(articlesRes?.total || 0)
        },
        recentQuotes: recentQuotes || [],
        recentContacts: recentContacts || []
      }
    });
  } catch (error) {
    console.error("Erreur Backend Admin Stats :", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};