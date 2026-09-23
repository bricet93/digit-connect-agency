import pool from '../config/db.js';
import PDFDocument from 'pdfkit';

const SERVICES_MAP = {
  strat_comm: { name: 'Élaboration de stratégies de communication', price: 150000 },
  community_mgmt: { name: 'Community management multiplateformes (Instagram, Facebook, TikTok, LinkedIn)', price: 150000 },
  influence_mkt: { name: 'Campagnes de marketing d’influence ciblées', price: 200000 },
  content_creation: { name: 'Création de contenu visuel & vidéo promotionnelle', price: 100000 },
  event_coverage: { name: 'Promotion et Couverture des événements', price: 250000 },
  visual_identity: { name: 'Identité visuelle et design graphique sur mesure', price: 100000 },
  web_ecommerce: { name: 'Création de sites web vitrines & e-commerce (WordPress, Shopify) + SEO', price: 300000 },
  it_support: { name: 'Support IT (maintenance, conseil, cybersécurité de base)', price: 120000 },
  print_design: { name: 'Conception et impression de supports (flyers, cartes, brochures)', price: 80000 },
  digital_consulting: { name: 'Consulting digital & IT', price: 150000 }
};

const formatMoney = (amount) => {
  return Math.round(amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fonction de génération unique du code DC-JJMMAA-XXX
const generateUniqueQuoteCode = async () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;

  let isUnique = false;
  let customCode = '';

  while (!isUnique) {
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    customCode = `DC-${dateStr}-${randomSuffix}`;

    const [existing] = await pool.query('SELECT id FROM quotes WHERE quote_code = ?', [customCode]);
    if (existing.length === 0) {
      isUnique = true;
    }
  }

  return customCode;
};

export const createQuote = async (req, res) => {
  try {
    const { client_name, client_email, client_phone, client_segment, selected_services, estimated_total } = req.body;

    if (!client_name || !client_email || !client_phone || !selected_services) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const quoteCode = await generateUniqueQuoteCode();

    const [result] = await pool.query(
      `INSERT INTO quotes (quote_code, client_name, client_email, client_phone, client_segment, selected_services, estimated_total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [quoteCode, client_name, client_email, client_phone, client_segment, JSON.stringify(selected_services), estimated_total]
    );

    return res.status(201).json({
      success: true,
      message: 'Devis enregistré avec succès !',
      quoteCode: quoteCode,
      quoteId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllQuotes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadQuotePDF = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Recherche par quote_code ou id (retrocompatibilité)
    const [rows] = await pool.query('SELECT * FROM quotes WHERE quote_code = ? OR id = ?', [code, code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Devis introuvable.' });
    }

    const quote = rows[0];
    const quoteRef = quote.quote_code || `DC-${String(quote.id).padStart(4, '0')}`;
    
    const services = typeof quote.selected_services === 'string' 
      ? JSON.parse(quote.selected_services) 
      : quote.selected_services;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Devis_${quoteRef}.pdf`);

    doc.pipe(res);

    // En-tête
    doc.rect(0, 0, 595.28, 12).fill('#00269A');
    doc.rect(0, 12, 595.28, 4).fill('#E50695');

    doc.fillColor('#00269A').fontSize(20).font('Helvetica-Bold').text('DIGIT-CONNECT ', 40, 45, { continued: true });
    doc.fillColor('#E50695').text('AGENCY');
    doc.fillColor('#00C1DE').fontSize(9).font('Helvetica-Oblique').text("De l'idée à l'impact");
    
    doc.fillColor('#666666').fontSize(8).font('Helvetica')
       .text('Douala, Cameroun | contact@digit-connect.agency', 40, 78);

    const dateFormatted = new Date(quote.created_at || Date.now()).toLocaleDateString('fr-FR');
    doc.fillColor('#00269A').fontSize(16).font('Helvetica-Bold').text('DEVIS ESTIMATIF', 350, 45, { align: 'right' });
    doc.fillColor('#333333').fontSize(9).font('Helvetica')
       .text(`Réf : ${quoteRef}`, 350, 65, { align: 'right' })
       .text(`Date : ${dateFormatted}`, 350, 78, { align: 'right' });

    doc.moveTo(40, 100).lineTo(555, 100).strokeColor('#EEEEEE').lineWidth(1).stroke();

    // Infos Client
    doc.rect(40, 115, 515, 70).fill('#F8FAFC').strokeColor('#E2E8F0').lineWidth(1).stroke();
    
    doc.fillColor('#00269A').fontSize(10).font('Helvetica-Bold').text('INFORMATIONS CLIENT', 55, 125);
    doc.fillColor('#333333').fontSize(9).font('Helvetica')
       .text(`Nom / Structure : `, 55, 142, { continued: true }).font('Helvetica-Bold').text(quote.client_name)
       .font('Helvetica').text(`Email : ${quote.client_email}`, 55, 156)
       .text(`Téléphone : ${quote.client_phone}`, 300, 142)
       .text(`Segment : ${(quote.client_segment || 'pme').toUpperCase()}`, 300, 156);

    // Tableau des Services
    const tableTop = 210;
    doc.rect(40, tableTop, 515, 24).fill('#00269A');
    doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
    doc.text('DESCRIPTION DU SERVICE', 50, tableTop + 7);
    doc.text('PRIX ESTIMATIF', 410, tableTop + 7, { width: 130, align: 'right' });

    let yPosition = tableTop + 24;

    services.forEach((serviceId, index) => {
      const item = SERVICES_MAP[serviceId] || { name: serviceId, price: 0 };
      const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

      doc.rect(40, yPosition, 515, 28).fill(rowBg);
      doc.fillColor('#333333').fontSize(8.5).font('Helvetica').text(item.name, 50, yPosition + 8, { width: 350 });
      
      doc.fillColor('#333333').fontSize(8.5).font('Helvetica-Bold')
         .text(`${formatMoney(item.price)} FCFA`, 410, yPosition + 8, { width: 130, align: 'right' });

      doc.moveTo(40, yPosition + 28).lineTo(555, yPosition + 28).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
      yPosition += 28;
    });

    // Total
    yPosition += 15;
    doc.rect(315, yPosition, 240, 35).fill('#00269A');
    doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold').text('TOTAL ESTIMÉ :', 325, yPosition + 12);
    
    doc.fillColor('#00C1DE').fontSize(11).font('Helvetica-Bold')
       .text(`${formatMoney(quote.estimated_total)} FCFA`, 410, yPosition + 12, { width: 135, align: 'right' });

    // Pied de page
    doc.fillColor('#666666').fontSize(8).font('Helvetica-Oblique')
       .text('* Ce document est une estimation tarifaire générée automatiquement. Un devis définitif vous sera transmis après validation des spécifications techniques.', 40, 760, { width: 515, align: 'center' });

    doc.rect(0, 830, 595.28, 12).fill('#00269A');

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM quotes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Devis introuvable.' });
    }

    res.json({ success: true, message: 'Devis supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};