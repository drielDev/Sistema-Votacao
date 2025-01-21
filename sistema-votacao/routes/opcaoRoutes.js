const express = require('express');
const {
  createOpcao,
  getOpcoesByEnqueteId,
  votarOpcao,
  updateOpcao,
  deleteOpcao,
} = require('../controllers/opcaoController');

const router = express.Router();

router.post('/', createOpcao);
router.get('/:enqueteId', getOpcoesByEnqueteId);
router.put('/:id/votar', votarOpcao);
router.put('/:id', updateOpcao);
router.delete('/:id', deleteOpcao);

module.exports = router;
