const url = 'http://localhost:3000'; //put your URL, example: http://localhost:3000

const inputRole = document.getElementById('role').options;
const lastMessageSelect = document.getElementById('lastMessage').options
const userNameInput = document.getElementById('userName')
const userId = document.getElementById('userId')
const userPhone = document.getElementById('userPhone')

loadData()
//load user data
async function loadData() {
    const messageCodes = ["welcome", "tryAgainName", "confirmName", "cep", "confimCep", "tryAgainCep", "errorCep", "successCep", "main", "invalidOption", "choseRole", "confirmRole", "tryAgainRole", "successRole", "awaitingPassengers", "nearbyUsers", "awaitingDrivers", "noPassengers", "noDrivers", "driversFound", "passengersFound", "choseTheTimeToDrive", "recordCompleted"]
    messageCodes.forEach(code => {
        let option = document.getElementById('lastMessage').innerHTML
        option += `<option value="${code}">${code}</option>`
        document.getElementById('lastMessage').innerHTML = option
    })

    //get user
    const id = window.location.href.split('/').pop();
    const response = await fetch(`${url}/getuser/${id}`);
    const user = await response.json();

    const idUser = user.id
    const name = user.name
    const phone = user.phone
    const cep = user.cep
    const lastMessage = user.lastMessageCode
    const role = user.role
    const neighborhood = user.neighborhood
    const driver = user.driver

    for (let option of inputRole) {
        if (option.value === role) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    }

    for (let option of lastMessageSelect) {
        if (option.value === lastMessage) {
            option.selected = true;
        } else {
            option.selected = false;
        }
    }

    const saveButton = document.getElementById('saveButton')
    console.log(saveButton.className)
    console.log(saveButton.children[0].className)

    if (driver !== null) {
        document.getElementById('increaseTime').value = driver.increaseTime
        document.getElementById('tablePassengersContainer')
        saveButton.className = 'col-md-9 mb-5'
        saveButton.children[0].className = 'btn btn-success mt-5 w-75 mx-auto'
        let table = document.getElementById('tableBody').innerHTML
        for (const address of user.Addresses) {
            table += `
            <tr>
                <td>${address.name}</td>
                <td>${address.waypoint}</td>
                <td>${Math.round(address.duration)} min</td>
                <td>${address.distance} km</td>
            </tr>
            `
        }
        document.getElementById('tableBody').innerHTML = table
        
    } else {
        document.getElementById('increaseTimeContainer').remove()
        document.getElementById('tablePassengersContainer').remove()
    }

    userId.textContent = idUser
    userPhone.textContent = phone.replace('@c.us', '')
    document.getElementById('neighborhood').textContent = neighborhood
    userNameInput.value = name
}

async function updateUser() {
    const increaseTime = document.getElementById('increaseTime')

    console.log(increaseTime)
    const role = inputRole[inputRole.selectedIndex].value
    const userName = userNameInput.value
    const lastMessage = lastMessageSelect[lastMessageSelect.selectedIndex].value

    await fetch(`${url}/updateUser/${userId.textContent}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId.textContent,
            phone: userPhone.textContent + '@c.us',
            role,
            userName,
            lastMessage,
            increaseTime: increaseTime !== null ? increaseTime.value : null
        })

    }).then(() => window.location.reload())
}