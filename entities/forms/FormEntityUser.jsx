import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../../common/layout/row'
import { init, create, getList, remove, showContent } from '../duck/entityUser.duck'
import LabelAndSelect from '../../../common/form/LabelAndSelect'
import If from '../../../common/operator/If'
import Table from '../../../common/layout/Table'
import Content from '../../../common/template/Content'

class FormEntityUser extends Component {
    constructor(props) {
        super(props);
   
        this.onSubmit = this.onSubmit.bind(this)

        this.state = { users: [], filteredUsers: [], profiles: [] }
    }

    componentWillMount() {
        this.getUsers()
        this.getProfiles()
    }

    componentDidUpdate() {

        this.props.getList(this.props.parentId)

        let filteredUsers = [...this.state.users]

        // Removendo do select os usuários que já estão na lista de presença
        this.props.list.forEach(entityUser => {
            _.pullAllBy(filteredUsers, [{'id': entityUser.user_id}], 'id')
        })

        if(!_.isEqual(filteredUsers, this.state.filteredUsers)) this.setState({filteredUsers})
    }

    onSubmit(entityUser) {
        entityUser.entity_id = this.props.parentId
        this.props.create(entityUser)
    }

    getUsers = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/users?with=userProfiles:id,user_id,profile_id;userProfiles.profile:id,noun`)
        .then(resp => {
            const users = resp.data.data.data.map(user => {
                return {...user, profiles: user.user_profiles.map(userProfile => userProfile.profile)}
            })

            this.setState({ users })
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

    getProfiles = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/profiles`)
        .then(resp => {
            this.setState({ profiles: resp.data.data.data })
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

    handleUserChange = e => {
        let user = _.find(this.state.filteredUsers, ['id', Number.parseInt(e.target.value)])
        // console.log(user, e)
        
        if(user && user.profiles) this.setState({profiles: user.profiles})
    }

    renderTableHead = () => {
       return <Row style={{marginBottom: '-2rem', marginTop: '1rem', paddingLeft: '1rem'}}>               
            <Field name='user_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                cols='12 4' placeholder=' - Selecione o Usuário - ' onChange={this.handleUserChange}
                options={this.state.filteredUsers} error={this.props.errors} />
            <Field name='profile_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                cols='12 4' placeholder=' - Selecione o Perfil - ' 
                options={this.state.profiles} error={this.props.errors} />
            <button type='submit' className={`btn btn-${this.props.submitClass}`} style={{height: 'min-content'}}>
                Salvar
            </button>
        </Row>
    }

    onSubmit(e) {
        e.entity_id = this.props.parentId
        this.props.create(e)
    }

    render() {
        return (
            <>
                <If test={this.props.show == 'form' && this.props.parentId}>
                    <Content>
                        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                            <Table body={this.props.list} headComponent={this.renderTableHead()}
                            actions={{ remove: this.props.remove }} attributes={{ user: 'Usuário', profile: 'Perfil' }} />
                        </form>
                    </Content>
                </If>
                <If test={this.props.show === 'list'}>
                    <button className="btn btn-primary" onClick={() => this.props.showContent('form')}>Adicionar Usuário</button>
                    <br /><br />
                    <Table body={this.props.list} labelMobile="street" actions={{ update: this.props.showUpdate, remove: this.props.remove }}
                    attributes={{ user: 'Usuário', profile: 'Perfil' }} />
                </If>
            </>
        );
    }
}

FormEntityUser = reduxForm({ form: 'entityUserForm', destroyOnUnmount: false })(FormEntityUser)
const selector = formValueSelector('entityUserForm')
const mapStateToProps = state => ({
    user_id: selector(state, 'user_id'),
    parentId: state.form.entityForm.values.id,
    errors: state.entityUser.errors,
    list: state.entityUser.list,
    show: state.entityUser.show
})
const mapDispatchToProps = dispatch => bindActionCreators({ 
    init, create, getList, remove, showContent }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(FormEntityUser)