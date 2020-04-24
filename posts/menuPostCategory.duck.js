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
    city_id: null,
    user_id: null
}

// ACTIONS
export function getList(id) {
    const request = axios.get(`${process.env.REACT_APP_API_HOST}/menu_post_categories?search=menu_id:${id}&with=postCategory:id,title`)
    return {
        type: 'MENU_POST_CATEGORY_FETCHED',
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
        axios[method](`${process.env.REACT_APP_API_HOST}/menu_post_categories${id ? '/'+id : ''}`, filteredValues)
            .then(resp => {
                toastr.success('Sucesso', 'Operação Realizada com sucesso.')

                dispatch(getList(values.menu_id))
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

export function init() {
    return [
        initialize('menuPostCategoryForm', INITIAL_VALUES),
    ]
}

export function getValidation(errors) {
    return {
        type: 'MENU_POST_CATEGORY_FORM_ERRORS',
        payload: errors
    }
}

//REDUCER
export const menuPostCategoryReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'MENU_POST_CATEGORY_FETCHED':
            return { ...state, list: action.payload.data ? action.payload.data.data : [] }

        case 'MENU_POST_CATEGORY_FORM_ERRORS':
            return { ...state, errors: action.payload }

        default:
            return state;
    }
}