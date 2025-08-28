import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
}

const INITIAL_VALUES = {
    entity_id: null,
    user_id: null
}

// ACTIONS
export function getList(id) {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/entity_users?search=entity_id:${id};user.id:<>null&searchFields=entity_id:=;user.id:<>&searchJoin=and&with=user:id,name;profile:id,noun`)
        
    return {
        type: 'ENTITY_USER_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function remove(values) {
    return submit(values, 'delete')
}

function submit(values, method) {
    return dispatch => {
        const id = values.id ? values.id + 0 : ''
        let filteredValues = { ...values }
        if (id) delete filteredValues.id

        dispatch(getValidation({}))
        axios[method](`${process.env.REACT_APP_API_HOST}/entity_users${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')

                dispatch(getList(values.entity_id))
                dispatch(init())
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.log('Erro', e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data.errors) {
                    dispatch(getValidation(e.response.data.errors))
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }
}

export function showContent(flag) {
    return {
        type: 'ENTITY_USER_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(entityType) {
    return [
        showContent('form'),
        initialize('entityUserForm', entityType)
    ]
}

export function init() {
    return [
        initialize('entityUserForm', INITIAL_VALUES),
    ]
}

export function getValidation(errors) {
    return {
        type: 'ENTITY_USER_FORM_ERRORS',
        payload: errors
    }
}

//REDUCER
export const entityUserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ENTITY_USER_FETCHED':
            return { ...state, list: action.payload.data ? action.payload.data.data : [] }

        case 'ENTITY_USER_FORM_ERRORS':
            return { ...state, errors: action.payload }

        case 'ENTITY_USER_CONTENT_CHANGED':
            return {...state, show: action.payload}
        
            default:
            return state;
    }
}