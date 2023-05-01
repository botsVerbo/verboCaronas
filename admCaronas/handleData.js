import { User } from "../db.js";

export function getUsers() {
    return User.findAll({ raw: true })
}

export async function getUserById(id) {
    return await User.findOne({
        raw: true, where: {
            id: id
        }
    })
}

export function deleteUser(userId, res) {
    User.destroy({
        where: {
            id: userId
        }
    }).then(() => {
        console.log("Ususario excluido")
        res.redirect('/users')
    })
        .catch(error => console.log("Erro ao deletar o usuario" + error))
}