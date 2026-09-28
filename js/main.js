const btnCreateUser = document.getElementById('btn-Create');
const userName = document.getElementById('u-name');
const userEmail = document.getElementById('e-mail');
const userResult = document.getElementById('user-result');
const userData = document.getElementById('user-data');
const form = document.getElementById('login');

btnCreateUser.addEventListener('click', async () => {
    while (userData.firstChild) {
        userData.removeChild(userData.firstChild);
    }

    if (form.reportValidity()) {
        console.log(userName.value);
        console.log(userEmail.value);
        visibilityUserResult('flex');
        const liLoading = addLoadingText();
        userData.appendChild(liLoading);
        try {
            let data = await createUser(userName.value, userEmail.value);
            console.log(data);
            showUserData(data);
        } catch (error) {
            showError(error);
            console.log(error);
        }
        finally {
            //Siempre se ejecuta//
            userData.removeChild(liLoading);
        }
    }
});

async function createUser(nameUser, emailUser) {
    let response;

    const user = {
        name: nameUser,
        email: emailUser
    };

    try {
        response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    } catch (error) {
        const err = new Error('Error de Conexión');
        err.code = 'offline';
        throw err;
    }

    if (response.ok) {
        let data = await response.json();
        return data;
    } else {
        console.log(response.status);
        const error = new Error('Error HTTP');
        error.code = response.status;
        throw error;
    }
}

function addLoadingText() {
    const li = document.createElement('li');
    li.textContent = "Creating user..."
    return (li);
}

function visibilityUserResult(attribute) {
    userResult.style.display = attribute;
}

function showUserData(data) {
    const liId = document.createElement('li');
    const liNameUser = document.createElement('li');
    const liEmailUser = document.createElement('li');
    liId.style.color = 'var(--color-rose)';
    liId.textContent = `ID: ${data.id}`;
    liNameUser.textContent = `Name: ${data.name}`;
    liEmailUser.textContent = `Email: ${data.email}`;
    userData.appendChild(liId);
    userData.appendChild(liNameUser);
    userData.appendChild(liEmailUser);
}

function showError(error) {
    console.log(`Mensaje error: ${error.message}`);
    const liNotFound = document.createElement('li');
    switch (error.code) {
        case 400:
            liNotFound.textContent = 'Solicitud no procesada';
            break;
        case 401:
            liNotFound.textContent = 'Permiso no autorizado';
            break;
        case 403:
            liNotFound.textContent = 'Permiso denegado';
            break;
        case 409:
            liNotFound.textContent = 'Conflicto de datos';
            break;
        case 422:
            liNotFound.textContent = 'Datos no válidos';
            break;
        case 500:
            liNotFound.textContent = 'Error interno del servidor';
            break;
        case 503:
            liNotFound.textContent = 'El servidor esta temporalmente fuera de servicio';
            break;
        default:
            liNotFound.textContent = error.message;
    }
    userData.appendChild(liNotFound);
}