$(async function () {
    await getTableWithUsers();
    getNewUserForm();
    getDefaultModal();
    addNewUser();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findAllUsers: async () => await fetch('/api/users'),
    findOneUser: async (id) => await fetch(`/api/users/${id}`),
    addNewUser: async (user) => await fetch('/api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let rolesList = "";
                for (let i = 0; i < user.roles.length; i++) {
                    rolesList += user.roles[i].roleName;
                    rolesList += " ";
                }

                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstname}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>     
                            <td>${rolesList}</td>     
                            <td>
                                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#someDefaultModal" data-userid="${user.id}" data-action="edit">Edit</button>
                            </td>
                            <td>                              
                                <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#someDefaultModal" data-userid="${user.id}" data-action="delete">Remove</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button class="btn btn-secondary" id="closeButton" type="button" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        //console.log(contains(user.roles, 'ROLE_USER'));

        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="row justify-content-center">
                    <div class="col-8">
                        <div class="d-grid gap-2 text-center">
                            <input type="hidden" class="form-control" id="id" name="id" value="${user.id}"><br>
                            <div class="form-group">
                                <label for="firstname">Firstname</label>
                                <input type="text" class="form-control" id="firstname" name="firstname" value="${user.firstname}"><br>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Lastname</label>
                                <input type="text" class="form-control" id="lastname" name="lastname" value="${user.lastname}"><br>
                            </div>
                            <div class="form-group">
                                <label for="age">Age</label>
                                <input type="number" min="1" class="form-control" id="age" name="age" value="${user.age}"><br>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" name="email" value="${user.email}"><br>
                            </div>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" id="username" name="username" value="${user.username}"><br>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" name="password" value="${user.password}" disabled><br>
                            </div>     
                            <div class="form-group">
                                <label for="roless"><strong>Roles</strong></label>
                                    <select class="form-control" multiple name="rolesList" id="rolesSelect" size="2">
                                        <option name="ROLE_USER" value="ROLE_USER" id="1" ${contains(user.roles, 'ROLE_USER')}>ROLE_USER</option>
                                        <option name="ROLE_ADMIN" value="ROLE_ADMIN" id="2" ${contains(user.roles, 'ROLE_ADMIN')}>ROLE_ADMIN</option>
                                    </select>
                            </div>                     
                        </div>
                    </div>
                </div>
            </form>
        `;

        modal.find('.modal-body').append(bodyForm);
    })

    $("#closeButton").on('click', async () => {
        modal.modal('hide');
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let firstname = modal.find("#firstname").val();
        let lastname = modal.find("#lastname").val();
        let age = modal.find("#age").val();
        let email = modal.find("#email").val();
        let username = modal.find("#username").val();
        let password = modal.find("#password").val();
        let roles = getRoles(modal, '#rolesSelect option:selected');

        let data = {
            id: id,
            username: username,
            firstname: firstname,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}
async function deleteUser(modal, id) {

    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Remove user');

    let removeButton = `<button class="btn btn-danger" id="removeButton">Remove</button>`;
    let closeButton = `<button class="btn btn-secondary" id="closeButton" type="button" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(removeButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {

        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="row justify-content-center">
                    <div class="col-8">
                        <div class="d-grid gap-2 text-center">
                            <input type="hidden" class="form-control" id="id" name="id" value="${user.id}"><br>
                            <div class="form-group">
                                <label for="firstname">Firstname</label>
                                <input type="text" class="form-control" id="firstname" name="firstname" value="${user.firstname}" disabled><br>
                            </div>
                            <div class="form-group">
                                <label for="lastname">Lastname</label>
                                <input type="text" class="form-control" id="lastname" name="lastname" value="${user.lastname}" disabled><br>
                            </div>
                            <div class="form-group">
                                <label for="age">Age</label>
                                <input type="number" min="1" class="form-control" id="age" name="age" value="${user.age}" disabled><br>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" name="email" value="${user.email}" disabled><br>
                            </div>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" id="username" name="username" value="${user.username}" disabled><br>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password" name="password" value="${user.password}" disabled><br>
                            </div>     
                            <div class="form-group">
                                <label for="roless"><strong>Roles</strong></label>
                                    <select class="form-control" multiple name="rolesList" id="rolesSelect" size="2" disabled>
                                        <option name="ROLE_USER" value="ROLE_USER" ${contains(user.roles, 'ROLE_USER')}>ROLE_USER</option>
                                        <option name="ROLE_ADMIN" value="ROLE_ADMIN" ${contains(user.roles, 'ROLE_ADMIN')}>ROLE_ADMIN</option>
                                    </select>
                            </div>                     
                        </div>
                    </div>
                </div>
            </form>
        `;

        modal.find('.modal-body').append(bodyForm);
    })

    $("#closeButton").on('click', async () => {
        modal.modal('hide');
    })

    $("#removeButton").on('click', async () => {

        const response = await userFetchService.deleteUser(id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')

        let firstname = addUserForm.find('#AddNewUserFirstname').val();
        let lastname = addUserForm.find('#AddNewUserLastname').val();
        let age = addUserForm.find('#AddNewUserAge').val();
        let email = addUserForm.find('#AddNewUserEmail').val();
        let username = addUserForm.find('#AddNewUserUsername').val();
        let password = addUserForm.find('#AddNewUserPassword').val();
        let roles = getRoles(addUserForm, '#AddNewUserRoles option:selected');

        let data = {
            username: username,
            firstname: firstname,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#AddNewUserFirstname').val('');
            addUserForm.find('#AddNewUserLastname').val('');
            addUserForm.find('#AddNewUserAge').val('');
            addUserForm.find('#AddNewUserEmail').val('');
            addUserForm.find('#AddNewUserUsername').val('');
            addUserForm.find('#AddNewUserPassword').val('');
            addUserForm.find('#AddNewUserRoles').val('');

            const someTabTriggerEl = document.querySelector('#allUsersTab');
            const tab = new bootstrap.Tab(someTabTriggerEl);

            tab.show()
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}

function getRoles(form, element) {
    let roles = []
    $.each(form.find(element), function(index,value) {
        roles[index] = {
            id : value.id,
            roleName: value.value
        }
    });
    return roles
}

function contains(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].roleName === elem) {
            return 'selected';
        }
    }
}
