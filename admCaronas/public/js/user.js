const url = 'https://verbum.serveo.net'; //put your URL, example: http://localhost:3000
loadData()

//load user data
async function loadData() {
    const id = window.location.href.split('/').pop();
    const response = await fetch(`${url}/getuser/${id}`);
    const user = await response.json();

    const userId = user.id 
    const name = user.name
    const phone = user.phone
    const cep = user.cep
    const lastMessage = user.lastMessageCode
    const role = user.role
    const neighborhood = user.neighborhood

    document.getElementById('userId').textContent = userId
    document.getElementById('userPhone').textContent = phone.replace('@c.us', '')
    document.getElementById('neighborhood').textContent = neighborhood
    document.getElementById('userName').value = name
}