export const RESPONSES = {
    welcome: {
        code: 'welcome',
        message: () =>
            'Olá, seja bem vindo(a) ao verbo caronas!\nPor favor, informe seu nome:',
    },

    tryAgainName: {
        code: 'tryAgainName',
        message: () => 'Ok, vamos tentar novamente.\nPor favor, informe seu nome:',
    },

    confirmName: {
        code: 'confirmName',
        message: ({ name }) => `*${name}*, seu nome está certo?\n1 - Sim\n2 - Não`,
    },

    cep: {
        code: 'cep',
        message: () => 'Por favor, informe seu CEP:',
    },

    confimCep: {
        code: 'confirmCep',
        message: ({ address }) =>
            `Você confirma que mora em ${address}?\n1 - Sim\n2 - Não`,
    },

    tryAgainCep: {
        code: 'tryAgainCep',
        message: () => 'Ok, vamos tentar novamente.\nPor favor, informe seu CEP:',
    },

    errorCep: {
        code: 'errorCep',
        message: () =>
            'Houve um erro ao encontrar seu endereço. Por favor, tente novamente.',
    },

    successCep: {
        code: 'successCep',
        message: () => 'Seu endereço foi salvo com sucesso!',
    },

    main: {
        code: 'main',
        message: () => 'digite:\n1 - para pedir carona',
    },

    invalidOption: {
        code: 'invalidOption',
        message: () => 'Opção invalida! Por favor, tente novamente.',
    },

    choseRole: {
        code: 'choseRole',
        message: () => 'Você pretende:\n1 - dar carona\n2 - pedir carona',
    },

    confirmRole: {
        code: 'confirmRole',
        message: ({ value }) =>
            `Você confirma que escolheu a opção ${value}?\n1 - Sim\n2 - Não`,
    },

    tryAgainRole: {
        code: 'tryAgainRole',
        message: () =>
            'Ok, vamos tentar novamente.\nVocê pretende:\n1 - dar carona\n2 - pedir carona',
    },

    successRole: {
        code: 'successRole',
        message: () => 'Seu registro foi concluído com sucesso!',
    },

    awaitingPassengers: {
        code: 'awaitingPassengers',
        message: () => 'Por favor, aguarde enquantos encontramos passageiros.',
    },

    nearbyUsers: {
        code: 'nearbyUsers',
        message: ({ name, neighborhood, time, distance, contact }) =>
            `${name}, morador do bairro ${neighborhood}, acrescenta mais ${time}, e ${distance} na sua viagem até a igreja. Contato: ${contact}`,
    },

    awaitingDrivers: {
        code: 'awaitingDrivers',
        message: () => 'Enviamos seu contato para pessoas que podem te dar carona e estamos aguardando a resposta delas.'
    },

    noPassengers: {
        code: 'noPassengers',
        message: () => 'No momento não encontramos nenhum passageiro. Caso apareça algum, avisaremos'
    },

    noDrivers: {
        code: 'noDrivers',
        message: () => 'No momento não encontramos motoristas disponiveis para sua região.'
    },

    driversFound: {
        code: 'driversFound',
        message: () => 'Motorista(s) encontrado(s).'
    },

    passengersFound: {
        code: 'passengersFound',
        message: ({ passengersNumber }) => `Encontramos ${passengersNumber} passageiros.`
    },

    choseTheTimeToDrive: {
        code: 'choseTheTimeToDrive',
        message: () => 'Até quanto tempo você estaria disponível a acrescentar na sua rota para dar carona a alguém?\n\n1 - 3 minutos\n2 - 5 minutos\n3 - 10 minutos\n4 - 20 minutos'
    },

    recordCompleted: {
        code: 'recordCompleted',
        message: () => 'Seu registro já foi concluído.'
    }
};