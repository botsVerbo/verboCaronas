import { User, Driver, connect, Addresses } from "../db.js";

export function getUsers() {
    return User.findAll({ raw: true })
}

export async function getUserById(id) {
    return await User.findOne({
        include: [Driver, Addresses],
        where: {
            id: id
        }
    })
}

export async function updateUser(data, res) {
    connect.transaction(async (transaction) => {
        try {
            //find user
            const user = await User.findByPk(data.userId, { include: Driver, transaction });

            if (!user) {
                res.status(404).send('user not found')
                return
            }

            // Update data
            user.name = data.userName;
            user.lastMessageCode = data.lastMessage;
            const increaseTime = data.increaseTime

            if (user.driver) {
                if (data.role === 'passenger') {
                    user.role = data.role;
                    await user.driver.destroy({ where: user.userId })
                } else if(increaseTime !== null){
                    user.driver.increaseTime = increaseTime
                    await user.driver.update({ increaseTime: increaseTime }, { transaction });
                }
            } else if (data.role === 'driver') {
                await Driver.create({
                    userId: data.userId,
                    increaseTime: 5
                });
                user.role = data.role
            } else {
                user.role = data.role;
            }

            await user.save({ transaction });
        } catch (error) {
            // revert transaction
            console.log("ERROR: ", error)
            await transaction.rollback();
        }
    });
}

export function deleteUser(userId, res) {
    User.destroy({
        where: {
            id: userId
        },
        cascade: true
    }).then(() => {
        console.log("Ususario excluido")
        res.redirect('/users')
    })
        .catch(error => console.log("Erro ao deletar o usuario" + error))
}