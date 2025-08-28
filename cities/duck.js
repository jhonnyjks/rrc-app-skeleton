import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { name: '', user_id: '' }
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {}
    }

// ACTIONS
export function getList() {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/cities?search=state_id:21&with=user:id,name;cityStatus:id,name&orderBy=city_status_id&sortedBy=desc`)
    return {
        type: 'CITIES_FETCHED',
        payload: request
    }
}

export function  create(context, values) {
    return submit(context, values, 'post')
}

export function update(context, values) {

    // Removendo atributos do tipo Objeto.
    Object.keys(values).forEach(function(value, index) {
        if(!values[value] || values[value].id) delete values[value]
    })

    return submit(context, values, 'put')
}

function submit(context, values, method) {
    return dispatch => {
        const id = values.id ? values.id+0 : ''
        let filteredValues = {...values}
        if(id) delete filteredValues.id
        
        axios[method](`${process.env.REACT_APP_API_HOST}/cities${id ? '/'+id : ''}`, filteredValues)
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
    return initialize('cityForm', item)
}

// REDUCER
export function cityReducer (state = INITIAL_STATE, action) {
    switch(action.type) {
        case 'CITIES_FETCHED':
            return {...state, list: action.payload.data ? action.payload.data.data : []}

        default:
            return state;
    }
}