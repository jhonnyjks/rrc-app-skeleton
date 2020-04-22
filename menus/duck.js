import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { title: null, subtitle: null }
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
    }

// ACTIONS
export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/menus?with=menu:id,title`)
    return {
        type: 'MENUS_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}

function submit(values, method) {
    return dispatch => {
        const id = values.id ? values.id+0 : ''
        let filteredValues = {...values}
        if(id) delete filteredValues.id
        
        axios[method](`${process.env.REACT_APP_API_HOST}/menus${id ? '/'+id : ''}`, filteredValues)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
            dispatch(getList())
        })
        .catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
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

export function showContent(flag) {
    return {
        type: 'MENU_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(menu) {
    return [
        showContent('form'),
        initialize('menuForm', menu)
    ]
}

export function init() {
    return [
        initialize('menuForm', INITIAL_VALUES),
        showContent('list')
    ]
}

// REDUCER
export function menuReducer (state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'MENUS_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        case 'MENU_CONTENT_CHANGED':
            return {...state, show: action.payload}

        default:
            return state;
    }
}