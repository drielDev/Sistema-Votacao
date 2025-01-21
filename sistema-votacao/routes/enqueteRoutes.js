const express = require('express');
const {
  createEnquete,
  getAllEnquetes,
  getEnqueteById,
  updateEnquete,
  deleteEnquete,
} = require('../controllers/enqueteController');

const router = express.Router();

router.post('/', createEnquete);
router.get('/', getAllEnquetes);
router.get('/:id', getEnqueteById);
router.put('/:id', updateEnquete);
router.delete('/:id', deleteEnquete);

module.exports = router;
