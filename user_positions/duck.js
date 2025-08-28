import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { name: '', description: '' }
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
    }

// ACTIONS
export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/user_positions`)
    return {
        type: 'USER_POSITIONS_FETCHED',
        payload: request
    }
}

export function  create(context, values) {
    return submit(context, values, 'post')
}

export function update(context, values) {
    return submit(context, values, 'put')
}

export function remove(values) {
    return submit(null, values, 'delete')
}

function submit(context, values, method) {
    return dispatch => {
        const id = values.id ? values.id+0 : ''
        let filteredValues = {...values}
        if(id) delete filteredValues.id
        
        axios[method](`${process.env.REACT_APP_API_HOST}/user_positions${id ? '/'+id : ''}`, filteredValues)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
            dispatch(getList())
        
if(context) {
    const pathname = context.router.route.location.pathname
                
    switch(method) {
        case 'post':
            if(pathname) {
                context.router.history.push(pathname.substring(0, pathname.lastIndexOf('/')))
            }
        break;

        case 'put':
            if(pathname) {
                context.router.history.push(pathname.substring(0, pathname.lastIndexOf('/')))
            }
        break;
    }
}
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

export function init(item = INITIAL_VALUES) {
    return initialize('userPositionForm', item)
}

// REDUCER
export function userPositionReducer (state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'USER_POSITIONS_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        default:
            return state;
    }
}