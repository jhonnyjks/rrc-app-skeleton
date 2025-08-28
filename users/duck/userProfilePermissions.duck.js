import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'
import _ from 'lodash'

const INITIAL_VALUES = { route: '', attributes: {} }

export function getList(profile) {

    let profileId = profile.profile_id
    let userProfileId = profile.id

    return dispatch => {
        axios.get(`${process.env.REACT_APP_API_HOST}/permissions?search=profile_id:${profileId}&with=actions;scopes`)
            .then(resp => {
                // Declarando em um array para manipulável
                let permissions = resp.data.data

                axios.get(`${process.env.REACT_APP_API_HOST}/user_profiles/${userProfileId}?with=userProfileActions;userProfileScopes`)
                    .then(resp2 => {
                        let userProfile = resp2.data.data;

                        // Criar um mapa de ações de perfil de usuário
                        const userProfileActionsMap = {};
                        userProfile.user_profile_actions.forEach((userProfileAction, index) => {
                            userProfileActionsMap[index] = {
                                id: userProfileAction.id,
                                cpath: userProfileAction.cpath,
                                action: userProfileAction.action,
                                code: userProfileAction.code,
                            };
                        });

                        // Criar um mapa para rastrear ações já adicionadas
                        const addedActionsSet = new Set();

                        // Iterar sobre as permissions e preencher os campos
                        permissions.forEach(permission => {

                            // Inicialize permission.actions como um array vazio
                            permission.actions = permission.actions || [];

                            for (const index in userProfileActionsMap) {
                                if (userProfileActionsMap.hasOwnProperty(index)) {
                                    const userProfileActionData = userProfileActionsMap[index];

                                    if (userProfileActionData.cpath === permission.cpath) {

                                        // Criar uma chave para a combinação de ação e cpath
                                        const key = userProfileActionData.cpath + '-' + userProfileActionData.action + '-' + userProfileActionData.code;

                                        if (!addedActionsSet.has(key)) {

                                            const newAction = {
                                                id: userProfileActionData.id,
                                                permission_id: userProfileActionData.cpath,
                                                noun: userProfileActionData.action,
                                                code: userProfileActionData.code
                                            };
                                            permission.actions.push(newAction);
                                            addedActionsSet.add(key);
                                        }
                                    }
                                }
                            }
                        });

                        // Criar um mapa de escopos de perfil de usuário
                        const userProfileScopesMap = {};
                        userProfile.user_profile_scopes.forEach((userProfileScope, index) => {
                            userProfileScopesMap[index] = {
                                id: userProfileScope.id,
                                cpath: userProfileScope.cpath,
                                scope: userProfileScope.scope,
                                code: userProfileScope.code,
                            };
                        });

                        // Criar um mapa para rastrear escopos já adicionados
                        const addedScopesSet = new Set();

                        // Iterar sobre as permissions e preencher os campos
                        permissions.forEach(permission => {

                            // Inicialize permission.actions como um array vazio
                            permission.scopes = permission.scopes || [];

                            for (const index in userProfileScopesMap) {
                                if (userProfileScopesMap.hasOwnProperty(index)) {
                                    const userProfileScopeData = userProfileScopesMap[index];

                                    if (userProfileScopeData.cpath === permission.cpath) {

                                        // Criar uma chave para a combinação de ação e cpath
                                        const key = userProfileScopeData.cpath + '-' + userProfileScopeData.action + '-' + userProfileScopeData.code;

                                        if (!addedScopesSet.has(key)) {

                                            const newScope = {
                                                id: userProfileScopeData.id,
                                                permission_id: userProfileScopeData.cpath,
                                                noun: userProfileScopeData.scope,
                                                code: userProfileScopeData.code
                                            };
                                            permission.scopes.push(newScope);
                                            addedScopesSet.add(key);
                                        }
                                    }
                                }
                            }
                        });

                        
                    })
                    .catch(error => {
                        console.error('Erro ao buscar userProfile: ', error);
                    });
                
                // Concatenando o array de permissões a todas as permissões disponíveis
                axios.get(`${process.env.REACT_APP_API_HOST}/permissions/all`)
                    .then(resp3 => {

                        // Para cada permissão, verifica de ela já está no array 'permissions', e trata como deve
                        resp3.data.data.forEach(permission => {
                            const cpath = permission.route.replace('api/', '')
                            let i = _.findIndex(permissions, { cpath })

                            // Se achou a permissão, verifica os atributos
                            if (i > -1) {
                                // Invertendo para que os atributos virem as chaves do elemento
                                let attributes = _.invert(permission.attributes)
                                let scopes = _.invert(permission.scopes)

                                // Removendo do array de atributos os atributos que já estão no array de permissões

                                if (permissions[i].actions) {
                                    permissions[i].actions.forEach(attr => {
                                        delete attributes[attr.noun]
                                    })
                                } else {
                                    permissions[i].actions = [];
                                }

                                if (permissions[i].scopes) {
                                    permissions[i].scopes.forEach(scope => {
                                        delete scopes[scope.noun]
                                    })
                                } else {
                                    permissions[i].scopes = [];
                                }

                                // Completando o array de permissões com os atributos que esse perfil não tem acesso ainda
                                // Sempre com 'code: 0', já que o perfil não tem permissão de acesso a estes.
                                for (var key in attributes) {
                                    if (attributes.hasOwnProperty(key)) {
                                        permissions[i].actions.push({
                                            id: null,
                                            permission_id: permissions[i].id,
                                            noun: key,
                                            code: 0
                                        })
                                    }
                                }
                                for (var key in scopes) {
                                    if (scopes.hasOwnProperty(key)) {
                                        permissions[i].scopes.push({
                                            id: null,
                                            permission_id: permissions[i].id,
                                            noun: key,
                                            code: 0
                                        })
                                    }
                                }
                            } else {

                                // concatenando à array as permissões que o perfil ainda não tem acesso
                                permissions.push({
                                    id: null,
                                    profile_id: profileId,
                                    permission_id: null,
                                    priority: 1,
                                    cpath,
                                    actions: permission.attributes.map(attr => ({
                                        id: null,
                                        permission_id: null,
                                        noun: attr,
                                        code: 0
                                    })),
                                    scopes: permission.scopes.map(scope => ({
                                        id: null,
                                        permission_id: null,
                                        noun: scope,
                                        code: 0
                                    }))
                                })
                            }
                        });

                        console.log(permissions);

                        dispatch({
                            type: 'PERMISSIONS_FETCHED',
                            payload: permissions
                        })
                    })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.error(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

export function createPermission(values, callback = null, params = null) {
    return submit(values, 'post', callback, params)
}

export function updatePermission(values) {
    return submit(values, 'put')
}

export function removePermission(values) {
    return submit(values, 'delete')
}

/**
 * Método genérico para envio de requisições ao serviço de permissões
 * @param {*} values 
 * @param String method 
 */
function submit(values, method, callback = null, params = {}) {
    return dispatch => {

        //'id' vai para a url se for positivo e não vazio e se o metodo não for 'post'
        const id = values.id > 0 && method !== 'post' ? +values.id : ''
        let filteredValues = { ...values }
        // 'id' não pode ir como parâmetro
        delete filteredValues.id

        axios[method](`${process.env.REACT_APP_API_HOST}/permissions${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                if (callback !== null) {
                    dispatch(callback({ ...params, permission_id: resp.data.data.id }))
                }
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.error(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

// export function showContent(flag) {
//     return {
//         type: 'PERMISSION_FORM_SHOWED',
//         payload: flag
//     }
// }

// export function showUpdate(values) {
//     return [
//         showContent('form'),
//         initialize('permissionForm', values)
//     ]
// }

export function init() {
    return [
        initialize('permissionForm', INITIAL_VALUES),
        // showContent('list')
    ]
}

export function selectPermission(e, index) {
    e.preventDefault()
    return {
        type: 'PERMISSION_SELECTED',
        payload: index
    }
}

function actionSubmit(values, method, permission_type) {
    
    return dispatch => {
        //'id' vai para a url se for positivo e não vazio e se o metodo não for 'post'
        const id = values.id > 0 && method !== 'post' ? +values.id : ''
        let filteredValues = { ...values }
        // 'id' não pode ir como parâmetro
        delete filteredValues.id

        if(permission_type === 'atributo') {

            axios[method](`${process.env.REACT_APP_API_HOST}/user_profile_actions${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')
                dispatch({
                    type: 'PERMISSION_CHANGED',
                    payload: { ...values, id: resp.data.data?.id ? resp.data.data.id : null, permission_type }
                })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.error(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
        } else if(permission_type === 'scope') {

            console.log('values: ', values);

            axios[method](`${process.env.REACT_APP_API_HOST}/user_profile_scopes${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Scope alterado com sucesso.')
                dispatch({
                    type: 'PERMISSION_CHANGED',
                    payload: { ...values, id: resp.data.data?.id ? resp.data.data.id : null, permission_type }
                })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.error(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    Object.entries(e.response.data.errors).forEach(
                        ([key, error]) => toastr.error(key, error[0]))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
        }
    }
}

export function createAction(values, permission_type) {
    return actionSubmit(values, 'post', permission_type)
}

export function updateAction(values, permission_type) {
    return actionSubmit(values, 'put', permission_type)
}

export function removeAction(values, permission_type) {
    return actionSubmit(values, 'delete', permission_type)
}

export function changeAttribute(event, action, permission, permission_type) {

    let code = action.code + (event.target.checked ? +event.target.value : -event.target.value)

    console.log(action);

    // Se tem ID, altera ou deleta
    if (action.id > 0) {

        if (code > 0) {
            console.log('atualizando');
            return updateAction({ ...action, code }, permission_type)
        } else {
            console.log('removendo');
            return removeAction({ ...action, code }, permission_type)
        }

        // Se não tem ID, mas tem código válido, insere a permissão ao atributo
    } else if (code > 0) {

        if (code > action.code)  {
            code = code - action.code
        }

        console.log('criando');

        // Se a rota já existe em permissions, insera a action. Senão, cria a rota em permissions
        // e depois insere a action
        if (action.permission_id > 0 || permission.id > 0) {
            return createAction({ ...action, code }, permission_type)
        } else {
            return createPermission({
                profile_id: permission.profile_id,
                cpath: permission.cpath,
                priority: permission.priority
            }, createAction, { ...action, code })
        }
    }

    return {
        type: 'PERMISSION_CHANGED',
        payload: { ...action, code, permission_type }
    }
}