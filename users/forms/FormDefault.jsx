import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import _ from 'lodash'
import { toastr } from 'react-redux-toastr'

import Row from '../../../common/layout/row'
import LabelAndInput from '../../../common/form/LabelAndInput'
import LabelAndSelect from '../../../common/form/LabelAndSelect'
import { init, create, update } from '../duck'
import BackButton from '../../../common/form/BackButton'
import SubmitButton from '../../../common/form/SubmitButton'

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = { generalStatuses: [], userPositions: [] }
        
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillMount() {
        this.getGeneralStatuses()
        this.getUserPositions()
    }

    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/general_statuses`)
        .then(resp => {
            this.setState({ generalStatuses: resp.data.data })
        })
        .catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }

    getUserPositions = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/user_positions`)
        .then(resp => {
            this.setState({ userPositions: resp.data.data })
        })
        .catch(e => {
            if (!e.response) {
                toastr.error('Erro', 'Desconhecido :-/')
                console.log(e)
            } else if (!e.response.data) {
                toastr.error('Erro', e.response.message)
            } else if (e.response.data) {
                toastr.error('Erro', e.response.data.message)
            }
        })
    }

    // cancelar(){
    //     var rotaAtual = window.location.href;
    //     var posicaoUsers = rotaAtual.indexOf('/users');
    //     var rotaDesejada = posicaoUsers !== -1 ? rotaAtual.substring(0, posicaoUsers + '/users'.length) : rotaAtual;
    //     window.location.href = rotaDesejada
    // }

    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }
    
    onSubmit(item) {
        if (item.id) {
            this.props.update(this.context, item)
        } else {
            this.props.create(this.context, item)
        }
    }

    render() {

        const user = this.props.users.find(user => user.id === parseInt(this.props.userId, 10));
    
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}> 
                <Row>
                    <Field name='name' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                        label='Nome' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                    <Field name='email' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                        type='email' label='E-mail' cols='12 4' placeholder='seu.email@mail.com' error={this.props.errors} />
                    <Field name='login' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                        label='Login' cols='12 4' placeholder='Informe o login' error={this.props.errors} />
                </Row>
                <Row>
                    <Field name='password' component={LabelAndInput} type="password" readOnly={user && user.auth_type_id === 2 ? true : false}
                        label='Senha' cols='12 4' placeholder='Informe a senha' error={this.props.errors} />
                    <Field name='general_status_id' component={LabelAndSelect} readOnly={user && user.auth_type_id === 2 ? true : false}
                        label='Status' cols='12 4' placeholder=' - Selecione - ' 
                        options={this.state.generalStatuses} error={this.props.errors} />
                    <Field name='user_position_id' component={LabelAndSelect} readOnly={user && user.auth_type_id === 2 ? true : false}
                        label='Cargo' cols='12 4' placeholder=' - Selecione - ' 
                        options={this.state.userPositions} error={this.props.errors} />
                </Row>
                <Row>
                    <Field name='registration' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                            label='Matrícula' cols='12 4' placeholder='Informe a matrícula' error={this.props.errors} />
                    <Field name='document' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                            label='Número do documento' cols='12 4' placeholder='CPF/CNPJ' error={this.props.errors} />
                    <Field name='celphone' component={LabelAndInput} readOnly={user && user.auth_type_id === 2 ? true : false}
                            label='Whatsapp' cols='12 4' placeholder='Informe o número de whatsapp' error={this.props.errors} />
                </Row>
                <div>
                    {(user && user.auth_type_id === 1) || !user ? (
                        <SubmitButton label='Salvar' />
                    ) : null}
                    <BackButton label='Cancelar' />
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'userForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('userForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    email: selector(state, 'email'),
    login: selector(state, 'login'),
    password: selector(state, 'password'),
    registration: selector(state, 'registration'),
    general_status_id: selector(state, 'general_status_id'),
    user_position_id: selector(state, 'user_position_id'),
    celphone: selector(state, 'celphone'),
    errors: state.user.errors,
    userId: state.form.userForm && state.form.userForm.initial && state.form.userForm.initial.id ? state.form.userForm.initial.id : false,
    users: state.user.list,
})
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)