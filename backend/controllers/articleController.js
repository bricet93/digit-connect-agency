import pool from '../config/db.js';

// Créer un nouvel article
export const createArticle = async (req, res) => {
  try {
    const { 
      slug, title_fr, title_en, content_fr, content_en, 
      excerpt_fr, excerpt_en, category, cover_image, is_published 
    } = req.body;

    const author_id = req.admin ? req.admin.id : null;

    const [result] = await pool.query(
      `INSERT INTO articles 
       (author_id, slug, title_fr, title_en, content_fr, content_en, excerpt_fr, excerpt_en, category, cover_image, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        author_id, 
        slug, 
        title_fr, 
        title_en, 
        content_fr, 
        content_en, 
        excerpt_fr || null, 
        excerpt_en || null, 
        category, 
        cover_image || null, 
        is_published ? 1 : 0
      ]
    );

    res.status(201).json({ success: true, message: 'Article créé avec succès', articleId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer les articles publiés (Site Public)
export const getPublicArticles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE is_published = 1 ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer UN article par slug + incrémenter views_count
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [articles] = await pool.query('SELECT * FROM articles WHERE slug = ? AND is_published = 1', [slug]);

    if (articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Article non trouvé' });
    }

    // Incrémenter le compteur de vues
    await pool.query('UPDATE articles SET views_count = views_count + 1 WHERE id = ?', [articles[0].id]);

    res.json({ success: true, data: articles[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Récupérer TOUS les articles (Dashboard Admin)
export const getAdminArticles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour un article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      slug, title_fr, title_en, content_fr, content_en, 
      excerpt_fr, excerpt_en, category, cover_image, is_published 
    } = req.body;

    await pool.query(
      `UPDATE articles 
       SET slug=?, title_fr=?, title_en=?, content_fr=?, content_en=?, 
           excerpt_fr=?, excerpt_en=?, category=?, cover_image=?, is_published=?
       WHERE id=?`,
      [
        slug, title_fr, title_en, content_fr, content_en, 
        excerpt_fr || null, excerpt_en || null, category, cover_image || null, is_published ? 1 : 0, id
      ]
    );

    res.json({ success: true, message: 'Article mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer un article
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};