import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

const INITIAL_VALUES = {name: '', login: '', password: '', general_status_id: ''}
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

export function getList(search = '',all=false) {
    const url = `${process.env.REACT_APP_API_HOST}/users?with=generalStatus&orderBy=name&sortedBy=asc${search.length > 0 ? '&' + search.slice(1) : ''}${all?'&all=true':''}`;
    const request = axios.get(url);
    
    return {
        type: 'USERS_FETCHED',
        payload: request
    };
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

export function remove(values) {
    return submit(null, values, 'delete')
}

function submit(context, values, method) {
    return dispatch => {
        const id = values.id ? values.id+0 : ''
        let filteredValues = {...values}
        if(id) delete filteredValues.id
        
        axios[method](`${process.env.REACT_APP_API_HOST}/users${id ? '/'+id : ''}`, filteredValues)
        .then(resp => {
            toastr.success('Sucesso', 'Operação Realizada com sucesso.')
            dispatch(init())
            dispatch(getList())
        
if(context) {
    const pathname = context.router.route.location.pathname
                
    switch(method) {
        case 'post':
            if (pathname) {
                const id = resp.data.data.id;
                context.router.history.push(pathname.substring(0, pathname.lastIndexOf(`/0`)+1) + id)
            }              
        break;

        case 'put':
            if(pathname) {
                console.log(pathname);
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
                dispatch(errorFetched(e.response.data.errors))
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }
}

export function init(item = INITIAL_VALUES) {
    return initialize('userForm', item)
}

export function errorFetched(e) {
    return {
        type: 'ERROR_FETCHED',
        payload: e
    }
}

// REDUCER
export function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'USERS_FETCHED':
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

        case 'ERROR_FETCHED':
            return { ...state, errors: action.payload }

        default:
            return state;
    }
}