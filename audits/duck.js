import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { initialize } from 'redux-form'

// STATES
const INITIAL_VALUES = { name: '', content: '' }
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
export function getList(search = '') {
    let url = `${process.env.REACT_APP_API_HOST}/audits?with=user&filter=*&orderBy=created_at&sortedBy=desc${search.length > 0 ? '&' + search.slice(1) : ''}&searchJoin=and`
    const request = axios.get(url)
    return {
        type: 'AUDITS_FETCHED',
        payload: request
    }
}
export function getListExcel(search = '') {
    let url = `${process.env.REACT_APP_API_HOST}/audits?with=user&filter=*&orderBy=created_at&sortedBy=desc${search.length > 0 ? '&' + search.slice(1) : ''}&searchJoin=and&excel=true`
    const request = axios.get(url)
    return request.then(response => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exportacao.xlsx"); // Nome do arquivo
        document.body.appendChild(link);
        link.click();
        link.remove();
        return response
    });
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
        
        axios[method](`${process.env.REACT_APP_API_HOST}/audits${id ? '/'+id : ''}`, filteredValues)
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
    return initialize('auditForm', item)
}


// REDUCER
export function auditReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'AUDITS_FETCHED':
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
            }
        case 'AUDITS_EXPORT_FETCHED':
            let response = action.payload.data && action.payload.data.data
                ? (action.payload.data.data.data || action.payload.data.data)
                : [];

            return { 
                ...state, 
                list_exports: response,
            }
        case 'ERROR_FETCHED':
            return { ...state, errors: action.payload }

        default:
            return state;
    }
}