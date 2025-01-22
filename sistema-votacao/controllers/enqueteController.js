const Enquete = require('../models/enquete');
const Opcao = require('../models/opcao');

// Criar uma nova enquete com opções
const createEnquete = async (req, res) => {
  try {
    const { titulo, data_inicio, data_fim, opcoes } = req.body;

    if (new Date(data_inicio) >= new Date(data_fim)) {
      return res.status(400).json({ error: 'A data de início deve ser anterior à data de término.' });
    }

    const enquete = await Enquete.create({ titulo, data_inicio, data_fim });

    // Criar as opções associadas à enquete
    if (opcoes && opcoes.length > 0) {
      const opcoesCriadas = await Promise.all(
        opcoes.map(descricao => Opcao.create({ descricao, enqueteId: enquete.id }))
      );
      enquete.Opcoes = opcoesCriadas;
    }

    res.status(201).json(enquete);
  } catch (error) {
    console.error('Erro ao criar enquete:', error);
    res.status(500).json({ error: 'Erro ao criar enquete' });
  }
};

// Listar todas as enquetes
const getAllEnquetes = async (req, res) => {
  try {
    const enquetes = await Enquete.findAll({
      include: {
        model: Opcao,
        as: 'Opcoes', // Deve ser exatamente o mesmo alias do relacionamento
      },
    });

    res.status(200).json(enquetes);
  } catch (error) {
    console.error('Erro ao buscar enquetes:', error);
    res.status(500).json({ error: 'Erro ao buscar enquetes', detalhes: error.message });
  }
};



// Função para obter os detalhes de uma enquete, incluindo as opções
const getEnqueteById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquete = await Enquete.findByPk(id, {
      include: [{ model: Opcao, as: 'Opcoes' }],
    });

    if (!enquete) {
      return res.status(404).json({ error: 'Enquete não encontrada' });
    }

    res.status(200).json(enquete);
  } catch (error) {
    console.error('Erro ao buscar detalhes da enquete:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da enquete' });
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
