const Enquete = require('../models/enquete');
const Opcao = require('../models/opcao');

// Criar uma nova enquete
const createEnquete = async (req, res) => {
  try {
    const { titulo, data_inicio, data_fim } = req.body;
    const enquete = await Enquete.create({ titulo, data_inicio, data_fim });
    res.status(201).json(enquete);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar enquete' });
  }
};

// Listar todas as enquetes
const getAllEnquetes = async (req, res) => {
  try {
    const enquetes = await Enquete.findAll({
      include: Opcao, // Inclui as opções de cada enquete
    });
    res.status(200).json(enquetes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar enquetes' });
  }
};

// Obter uma enquete específica
const getEnqueteById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquete = await Enquete.findByPk(id, {
      include: Opcao, // Inclui as opções de resposta
    });
    if (enquete) {
      res.status(200).json(enquete);
    } else {
      res.status(404).json({ error: 'Enquete não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar enquete' });
  }
};

// Atualizar uma enquete
const updateEnquete = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, data_inicio, data_fim } = req.body;
    const enquete = await Enquete.findByPk(id);
    if (enquete) {
      enquete.titulo = titulo;
      enquete.data_inicio = data_inicio;
      enquete.data_fim = data_fim;
      await enquete.save();
      res.status(200).json(enquete);
    } else {
      res.status(404).json({ error: 'Enquete não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar enquete' });
  }
};

// Excluir uma enquete
const deleteEnquete = async (req, res) => {
  try {
    const { id } = req.params;
    const enquete = await Enquete.findByPk(id);
    if (enquete) {
      await enquete.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Enquete não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir enquete' });
  }
};

module.exports = {
  createEnquete,
  getAllEnquetes,
  getEnqueteById,
  updateEnquete,
  deleteEnquete,
};
