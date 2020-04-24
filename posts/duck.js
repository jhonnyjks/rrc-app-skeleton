import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { title: null, content: null }
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
    }

// ACTIONS
export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/posts?with=postCategory:id,title`)
    return {
        type: 'POSTS_FETCHED',
        payload: request
    }
}

export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    // Removendo atributos do tipo Objeto.
    Object.keys(values).forEach(function(value, index) {
        if(!values[value] || values[value].id) delete values[value]
    })

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
        
        axios[method](`${process.env.REACT_APP_API_HOST}/posts${id ? '/'+id : ''}`, filteredValues)
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
        type: 'POST_CONTENT_CHANGED',
        payload: flag
    }
}

export function showUpdate(post) {
    return [
        showContent('form'),
        initialize('postForm', post)
    ]
}

export function init() {
    return [
        initialize('postForm', INITIAL_VALUES),
        showContent('list')
    ]
}

// REDUCER
export function postReducer (state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'POSTS_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        case 'POST_CONTENT_CHANGED':
            return {...state, show: action.payload}

        default:
            return state;
    }
}