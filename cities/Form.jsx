import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import { init, create, update } from './duck'
import BackButton from '../../common/form/BackButton'
import SubmitButton from '../../common/form/SubmitButton'

class Form extends Component {

    constructor(props) {
        super(props)

        this.state = { users: [], statuses: [] }

        this.onSubmit = this.onSubmit.bind(this)    
    }

    componentWillMount() {
        this.getUsers()
        this.getStatuses()
    }

    getUsers = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/users`)
        .then(resp => {
            this.setState({ users: resp.data.data })
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

    getStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/city_statuses`)
        .then(resp => {
            this.setState({ statuses: resp.data.data })
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
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Município</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='name' component={LabelAndInput} readOnly={this.props.readOnly} disabled='true'
                                label='Nome' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                            <Field name='user_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Supervisor' cols='12 4' placeholder=' - Selecione - ' 
                                options={this.state.users} error={this.props.errors} />
                            <Field name='city_status_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Situação' cols='12 4' placeholder=' - Selecione - ' 
                                options={this.state.statuses} error={this.props.errors} />
                            <Field name='active_at' component={LabelAndInput} readOnly={true}
                                label='Ativo em' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                            <Field name='inactive_at' component={LabelAndInput} readOnly={true}
                                label='Inativo em' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                        </Row>
                    </div>
                    <div className='card-footer'>
                        <SubmitButton label='Salvar' />
                        <BackButton label='Cancelar' />
                    </div>
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'cityForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('cityForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    user_id: selector(state, 'user_id'),
    city_status_id: selector(state, 'city_status_id'),
    active_at: selector(state, 'active_at'),
    inactive_at: selector(state, 'inactive_at'),
    errors: state.city.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)