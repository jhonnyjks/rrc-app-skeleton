import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import { init, getList, remove } from './cityUser.duck'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import If from '../../common/operator/If'
import Table from '../../common/layout/Table'
import Content from '../../common/template/Content'

class FormCityUser extends Component {
    constructor(props) {
        super(props);
   
        this.onSubmit = this.onSubmit.bind(this)

        this.state = { users: [], filteredProfiles: [] }
    }

    componentWillMount() {
        if (this.props.parentId !== null) {
            this.props.getList(this.props.parentId)
            this.getProfiles()
        }
    }

    componentDidUpdate() {
        let filteredProfiles = [...this.state.users]

        // Removendo do select os studantes que já estão na lista de presença
        this.props.list.forEach(file => { 
            _.pullAllBy(filteredProfiles, [{'id': file.user_id}], 'id')
        })

        if(!_.isEqual(filteredProfiles, this.state.filteredProfiles)) this.setState({filteredProfiles})
    }

    onSubmit(cityUser) {
        cityUser.city_id = this.props.parentId
        this.props.onCreate(cityUser)
    }

    // onDelete(cityUser) {

    //     this.props.remove(cityUser)
    // }

    getProfiles = () => {
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

    renderTableHead = () => {
       return <Row style={{marginBottom: '-2rem', paddingLeft: '1rem'}}>               
            <Field name='user_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                cols='12 6' placeholder=' - Selecione - '
                options={this.state.filteredProfiles} error={this.props.errors} />
            <button type='submit' className={`btn btn-${this.props.submitClass}`} style={{height: 'min-content'}}>
                {this.props.submitLabel}
            </button>
        </Row>
    }

    render() {
        return (
            <If test={this.props.parentShow == 'form' && this.props.parentId}>
                <Content>
                    <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Table title='USUÁRIOS DESSE MUNICÍPIO' body={this.props.list} headComponent={this.renderTableHead()}
                        actions={{ remove: this.props.remove }} attributes={{ user: 'Usuário' }} />
                    </form>
                </Content>
            </If>
        );
    }
}

FormCityUser = reduxForm({ form: 'cityUserForm', destroyOnUnmount: false })(FormCityUser)
const selector = formValueSelector('cityUserForm')
const mapStateToProps = state => ({
    user_id: selector(state, 'user_id'),
    parentId: state.form.cityForm.values.id,
    errors: state.cityUser.errors,
    list: state.cityUser.list,
    parentShow: state.city.show
})
const mapDispatchToProps = dispatch => bindActionCreators({ 
    init, getList, remove }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(FormCityUser)