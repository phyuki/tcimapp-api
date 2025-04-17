const model = require('../models');

exports.getByEmail = async (emailUser) => {
    const exists = await model.patients.findOne({ where: { email: emailUser } });
    return exists ? exists.dataValues : '';
};

exports.getAllByProfessionalId = async (professionalId) => {
    const patients = await model.patients.findAll({ where: { professionalId } });
    return patients.map(p => p.dataValues);
};

exports.create = async ({ name, phone, email, address, professionalId }) => {
    const exists = await model.patients.findOne({ where: { email } });

    if (exists) {
        return {
            status: 409,
            data: { message: 'Email já cadastrado no sistema' }
        };
    }

    try {
        const newPatient = await model.patients.create({
            name,
            phone,
            email,
            address,
            professionalId
        });
        return {
            status: 200,
            data: newPatient
        };
    } catch (err) {
        return {
            status: 400,
            data: { message: 'Erro interno com o servidor' }
        };
    }
};

exports.update = async ({ id, name, phone, address, professionalId }) => {
    const [updated] = await model.patients.update(
        { name, phone, address, professionalId },
        { where: { id } }
    );
    if (updated === 1) {
        return 'O paciente foi atualizado com sucesso!';
    }
    return 'Erro ao atualizar paciente';
};
