const url = 'http://localhost:3000'; //put your URL, example: http://localhost:3000
loadUsers()

//filter users
function filterUsers() {
    const filterInput = document.getElementById('filter');
    const table = document.getElementById('users');
    const rows = table.getElementsByTagName('tr');

    const filterValue = filterInput.value.toLowerCase();

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let shouldShowRow = false;

        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.indexOf(filterValue) > -1) {
                shouldShowRow = true;
                break;
            }
        }

        if (shouldShowRow) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

//load and create users in table
function addUserInTable(id, name, phone, cep, lastMessage, role, neighborhood) {
    let table = document.getElementById('users').innerHTML
    table += `
    <tr onclick="location.href='/user/${id}'">
    <th scope="row">${id}</th>
    <td>${name}</td>
    <td>${phone}</td>
    <td>${cep}</td>
    <td>${lastMessage}</td>
    <td>${role}</td>
    <td>${neighborhood}</td>
    <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confimDelete" onclick="deleteUser(${id}); event.stopPropagation();"">Deletar</button></td>
    </tr>
    `
    document.getElementById('users').innerHTML = table
}

//get existing users
async function loadUsers() {
    const response = await fetch(`${url}/getusers`);
    const users = await response.json();
    for (const user of users) {
        const id = user.id
        const name = user.name
        const phone = user.phone
        const cep = user.cep
        const lastMessage = user.lastMessageCode
        const role = user.role
        const neighborhood = user.neighborhood
        addUserInTable(id, name, phone, cep, lastMessage, role, neighborhood)
    }
}

//delete user
function deleteUser(id) { //ALTERAR ESSA FUNÇÃO BUGADA
    const confirm = document.getElementById('confirmDeleteBtn');
    confirm.addEventListener('click', () => {
        fetch(`${url}/user/${id}`, { method: 'DELETE' }).then(() => window.location.reload())
    })

    const modalElement = document.getElementById('confimDelete');

    modalElement.addEventListener('hidden.bs.modal', () => {
        window.location.reload()
    })
}