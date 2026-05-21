const express = require('express');
const router = express.Router();

const connection = require('../../database/connection');

router.get('/ping', (req, res) => {
    res.json({ message: 'pong' })
});

router.get('/alunos', async (req, res) => {
    try {
        const alunos = await connection('alunos').select('*');

        res.json(alunos);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos' })
    }
});

router.post('/createAlunos', async (req, res) => {
    const { nome, idade, numero_chamada } = req.body;

    try {

        const [id] = await connection('alunos')
            .insert({ nome, idade, numero_chamada });

        if (!id) {
            return res.status(400).json({ error: 'Erro ao cadastrar aluno' });
        }

        res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso',
            id,
            nome,
            idade,
            numero_chamada
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar aluno' });
    }
});

// buscar aluno por ID
router.get('/buscarAluno/:id', async (req, res) => {

    const { id } = req.params;

    const alunos = await connection('alunos').select('*').where({ id }).first();

    res.json(alunos);

});

// atualizar aluno
router.put('/atualizarAluno/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade, numero_chamada } = req.body;

    try {
        const aluno = await connection('alunos')
        .where({ id })
        .update({ nome, idade, numero_chamada });

        if (!id) {
            return res.status(400).json({ error: 'Erro ao atualizar o aluno1' });
        }

        res.status(201).json({
            mensagem: 'Aluno atualizado com sucesso',
            id,
            nome,
            idade,
            numero_chamada
        });


    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar aluno2' });
    }

});

router.delete('/deletarAluno/:id', async (req, res) =>{
    const { id } = req.params;

    try {
        const alunoDeletado = await connection('alunos')
        .where({ id })
        .del();

        if(alunoDeletado === 0){
            return res.status(404).json({ error: 'Aluno não encontrado'})
        }
        
        return res.json({  mensagem: 'Aluno deletado com sucesso'});
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar aluno'});
    }


});

module.exports = router;