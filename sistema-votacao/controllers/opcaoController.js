const Opcao = require('../models/opcao');

// Criar uma nova opção de resposta para uma enquete
const createOpcao = async (req, res) => {
  try {
    const { descricao, enqueteId } = req.body;
    const opcoesCount = await Opcao.count({ where: { enqueteId } });
    if (opcoesCount >= 3) {
      return res.status(400).json({ error: 'A enquete deve ter no mínimo 3 opções.' });
    }
    const opcao = await Opcao.create({ descricao, enqueteId });
    res.status(201).json(opcao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar opção' });
  }
};

// Listar todas as opções de uma enquete
const getOpcoesByEnqueteId = async (req, res) => {
  try {
    const { enqueteId } = req.params;
    const opcoes = await Opcao.findAll({ where: { enqueteId } });
    res.status(200).json(opcoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar opções' });
  }
};

// Votação em uma opção
const votarOpcao = async (req, res) => {
  try {
    const { id } = req.params;
    const opcao = await Opcao.findByPk(id);
    if (opcao) {
      opcao.votos += 1;
      await opcao.save();
      res.status(200).json(opcao);
    } else {
      res.status(404).json({ error: 'Opção não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao votar' });
  }
};

// Atualizar uma opção
const updateOpcao = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao } = req.body;
    const opcao = await Opcao.findByPk(id);
    if (opcao) {
      opcao.descricao = descricao;
      await opcao.save();
      res.status(200).json(opcao);
    } else {
      res.status(404).json({ error: 'Opção não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar opção' });
  }
};

// Excluir uma opção
const deleteOpcao = async (req, res) => {
  try {
    const { id } = req.params;
    const opcao = await Opcao.findByPk(id);
    if (opcao) {
      await opcao.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Opção não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir opção' });
  }
};

module.exports = {
  createOpcao,
  getOpcoesByEnqueteId,
  votarOpcao,
  updateOpcao,
  deleteOpcao,
};
