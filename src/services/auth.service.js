const model = require('../models');

exports.register = async ({ emailUser, passwordUser, userType }) => {
    const [user, created] = await model.users.findOrCreate({
        where: { email: emailUser },
        defaults: { password: passwordUser, userType }
    });

    if (created) {
        return {
            status: 200,
            data: { alert: "Sucesso", message: "O usuário foi cadastrado com sucesso!" }
        };
    }

    return {
        status: 400,
        data: { alert: "Aviso", message: "Email já cadastrado no sistema" }
    };
};

exports.login = async ({ emailUser, passwordUser }) => {
    const exists = await model.users.findOne({
        where: { email: emailUser, password: passwordUser }
    });

    return exists ? exists.userType : 'F';
};