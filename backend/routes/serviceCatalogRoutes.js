import express from 'express';
import {
  getAllCatalogServices,
  checkIdExists,
  createCatalogService,
  updateCatalogService,
  deleteCatalogService
} from '../controllers/serviceCatalogController.js';

const router = express.Router();

router.get('/', getAllCatalogServices);
router.get('/check/:id', checkIdExists); // Route pour tester un ID
router.post('/', createCatalogService);
router.put('/:id', updateCatalogService);
router.delete('/:id', deleteCatalogService);

export default router;