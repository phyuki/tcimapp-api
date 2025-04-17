const model = require('../models');

exports.getByEmailOrId = async ({ emailUser, userId }) => {
    const whereClause = emailUser ? { email: emailUser } : { id: userId };
    const exists = await model.professionals.findOne({ where: whereClause });
    return exists ? exists.dataValues : userId;
};

exports.getAll = async () => {
    const professionals = await model.professionals.findAll();
    return professionals.map(p => p.dataValues);
};

exports.create = async ({ name, email, phone }) => {
    const newProfessional = await model.professionals.create({ name, email, phone });
    return newProfessional;
};

exports.update = async ({ id, name, phone, email }) => {
    const [updated] = await model.professionals.update(
        { name, phone, email },
        { where: { id } }
    );
    if (updated === 1) {
        return 'Seus dados foram atualizados com sucesso!';
    }
    return 'Erro ao atualizar profissional';
};