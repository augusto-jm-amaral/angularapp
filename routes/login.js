var jwt = require('jwt-simple');

module.exports = function(app) {

    const cfg = app.libs.config;
    const Usuarios = app.db.models.Usuarios;

    app.route(cfg.urlRaizApi + '/login')
        .post(function get(req, res) {

            req.checkBody('email').notEmpty();
            req.checkBody('senha').notEmpty();

            var erros = req.validationErrors();

            if (!erros) {

                var email = req.body.email;
                var senha = req.body.senha;

                Usuarios.findOne({
                    email: email
                }, function(err, usuario) {
                    if (usuario && !err) {
                        if (usuario.validarSenha(usuario.senha, senha)) {
                            const playload = {
                                _id: usuario._id
                            };
                            res.json({
                                token: jwt.encode(playload, cfg.jwtSecret),
                                nome: usuario.nome,
                                _id: usuario._id
                            }).end();
                        } else {
                            res.sendStatus(400).end();
                        }
                    } else {
                        res.sendStatus(400).end();
                    }
                });

            } else {
                res.sendStatus(400).end();
            }
        });
};