import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import _ from 'lodash'

import Row from '../../../common/layout/row'
import LabelAndInput from '../../../common/form/LabelAndInput'
import LabelAndSelect from '../../../common/form/LabelAndSelect'
import LabelAndTextArea from '../../../common/form/LabelAndTextArea'
import { init, create, update, remove } from '../duck'
import BackButton from '../../../common/form/BackButton'
import SubmitButton from '../../../common/form/SubmitButton'

class Form extends Component {
    
    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }

    constructor(props) {
        super(props);
        this.state = {
            modalities: [],
            entityTypes: [],
            entities: [],
            entityRegimes: [],
            entityExecutionModes: [],
            secretariats: [],
            generalStatuses: [],
            users: [],
            positions: [],
            measureUnitsunits: []
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(entity) {
        if (entity.id) {
            this.props.update(this.context, entity)
        } else {
            this.props.create(this.context, entity)
        }
    }

    componentWillMount() {
        this.getBiddingTypes()
        this.getEntities()
        this.getGeneralStatuses()
    }


    getUsers = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/users?with=userPosition`)
            .then(resp => {
                this.setState({ users: resp.data.data })

                // Necessário para carregar o campo de nome 'user_issuer_id' nos casos de edição e visualização da licitação
                this.handleIssuerChange({target: document.getElementsByName('user_issuer_id')[0]})
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

    getBiddingTypes = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/entity_types`)
            .then(resp => {
                this.setState({ entityTypes: resp.data.data.data })
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

    getEntities = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/entities`)
            .then(resp => {
                this.setState({ entities: resp.data.data.data })
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

    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/general_statuses`)
            .then(resp => {
                this.setState({ generalStatuses: resp.data.data })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Não foi possível recarregar a lista de status de entidades.')
                    console.log(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }

    handleIssuerChange = e => {
        const user = _.find(this.state.users, { 'id': Number.parseInt(e.target.value) })
        if (user && user.user_position) this.setState({ positions: [user.user_position] })

        this.setUserPosition()
    }

    setUserPosition = () => {
        setTimeout(() => {
            const field = document.getElementsByName('issuer_position')
            if (field[0]) {
                const opt = field[0].getElementsByTagName('option')
                if (opt && opt.length > 0) {
                    opt[opt.length - 1].selected = true
                }
            }
        }, 500)
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Row>
                    <Field name='name' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='Nome' cols='12 4 3' placeholder='' error={this.props.errors} />
                    <Field name='initials' component={LabelAndInput} readOnly={this.props.readOnly}
                            label='Sigla' cols='12 4 3' placeholder='' error={this.props.errors} />
                    <Field name='description' component={LabelAndInput} readOnly={this.props.readOnly}
                        label='Descrição' cols='12 2 2' placeholder='' error={this.props.errors} />
                    <Field name='entity_type_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                        label='Tipo' cols='12 2 2' placeholder=' - Selecione - ' options={this.state.entityTypes}
                        error={this.props.errors} />
                    <Field name='entity_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                        label='Entidade mãe' cols='12 4 3' placeholder=' - Selecione - ' options={this.state.entities}
                        error={this.props.errors} />
                    <Field name='general_status_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                        label='Status' cols='12 2 2 2' placeholder=' - Selecione - ' options={this.state.generalStatuses}
                        error={this.props.errors} />
                </Row>

                <div>
                    <SubmitButton label='Salvar' />
                    <BackButton label='Cancelar' />
                </div>

            </form>
        )
    }
}

Form = reduxForm({ form: 'entityForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('entityForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    entity_type_id: selector(state, 'entity_type_id'),
    entity_id: selector(state, 'entity_id'),
    initiais: selector(state, 'initiais'),
    general_status_id: selector(state, 'general_status_id'),
    errors: state.entity.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update, remove }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)