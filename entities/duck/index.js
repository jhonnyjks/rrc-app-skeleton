import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { name: '', description: '' }
const INITIAL_STATE = {
    list: [],
    show: 'list',
    errors: {},
    pagination: {
        current_page: null,
        last_page: null,
        total: null,
    }
}

// ACTIONS
export function getList(search = '', limit = 0, filters = '') {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/entities?with=generalStatus;entityType;entity${filters.length > 0 ? ' &filterID=' + filters : ''}${search.length > 0 ? '&' + search.slice(1) : ''}${limit > 0 ? '&limit=' + limit : ''}&orderBy=name&sortedBy=asc`)
    return {
        type: 'ENTITIES_FETCHED',
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
        
        axios[method](`${process.env.REACT_APP_API_HOST}/entities${id ? '/'+id : ''}`, filteredValues)
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
    return initialize('entityForm', item)
}

// REDUCER
export function entityReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'ENTITIES_FETCHED':
            const responseData = action.payload.data && action.payload.data.data
                ? (action.payload.data.data.data || action.payload.data.data)
                : [];
            
            const paginationData = action.payload.data.data

            return { 
                ...state, 
                list: responseData,
                pagination: {
                    current_page: paginationData.current_page,
                    last_page: paginationData.last_page,
                    total: paginationData.total,
                    to: paginationData.to,
from: paginationData.from,
                }
            };

        default:
            return state;
    }
}