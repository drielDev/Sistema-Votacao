// Importa os modelos de Opção e Enquete
const Opcao = require('../models/opcao');
const Enquete = require('../models/enquete'); // Caminho correto para o modelo Enquete

// Criar uma nova opção de resposta para uma enquete
const createOpcao = async (req, res) => {
  try {
    const { descricao, enqueteId } = req.body;

    console.log('Dados recebidos:', { descricao, enqueteId });

    // Verifique se a enquete existe
    const enquete = await Enquete.findByPk(enqueteId);
    if (!enquete) {
      console.error(`Enquete com ID ${enqueteId} não encontrada.`);
      return res.status(404).json({ error: 'Enquete não encontrada.' });
    }

    console.log(`Enquete encontrada: ${enquete.titulo}`);

    // Cria a opção no banco de dados
    const opcao = await Opcao.create({ descricao, enqueteId });
    console.log('Opção criada com sucesso:', opcao);

    res.status(201).json(opcao);
  } catch (error) {
    console.error('Erro ao criar opção:', error);
    res.status(500).json({ error: 'Erro ao criar opção', detalhes: error.message });
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

// Votar em uma opção
const votarOpcao = async (req, res) => {
  try {
    const { id } = req.params;

    // Inclui a enquete associada
    const opcao = await Opcao.findByPk(id, { include: { model: Enquete, as: 'Enquete' } });

    if (!opcao) {
      return res.status(404).json({ error: 'Opção não encontrada' });
    }

    // Verifica se a enquete está ativa
    const now = new Date();
    const dataInicio = new Date(opcao.Enquete.data_inicio);
    const dataFim = new Date(opcao.Enquete.data_fim);

    if (now < dataInicio || now > dataFim) {
      return res.status(400).json({ error: 'A enquete não está ativa no momento.' });
    }

    // Incrementa os votos
    opcao.votos += 1;
    await opcao.save();
    res.status(200).json(opcao); // Retorna a opção atualizada
  } catch (error) {
    console.error('Erro ao votar na opção:', error);
    res.status(500).json({ error: 'Erro ao votar', detalhes: error.message });
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

// Exporta as funções do controlador
module.exports = {
  createOpcao,
  getOpcoesByEnqueteId,
  votarOpcao,
  updateOpcao,
  deleteOpcao,
};