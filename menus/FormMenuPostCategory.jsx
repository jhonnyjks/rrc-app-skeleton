import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import { init, getList, remove } from './menuPostCategory.duck'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import If from '../../common/operator/If'
import Table from '../../common/layout/Table'
import Content from '../../common/template/Content'

class FormCityUser extends Component {
    constructor(props) {
        super(props);
   
        this.onSubmit = this.onSubmit.bind(this)

        this.state = { postCategories: [], filteredCategories: [] }
    }

    componentWillMount() {
        if (this.props.parentId !== null) {
            this.props.getList(this.props.parentId)
            this.getProfiles()
        }
    }

    componentDidUpdate() {
        let filteredCategories = [...this.state.postCategories]

        // Removendo do select os studantes que já estão na lista de presença
        this.props.list.forEach(file => { 
            _.pullAllBy(filteredCategories, [{'id': file.post_category_id}], 'id')
        })

        if(!_.isEqual(filteredCategories, this.state.filteredCategories)) this.setState({filteredCategories})
    }

    onSubmit(menuPostCategory) {
        menuPostCategory.menu_id = this.props.parentId
        this.props.onCreate(menuPostCategory)
    }

    // onDelete(menuPostCategory) {

    //     this.props.remove(menuPostCategory)
    // }

    getProfiles = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/post_categories`)
        .then(resp => {
            this.setState({ postCategories: resp.data.data })
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
            <Field name='post_category_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                cols='12 6' placeholder=' - Selecione - '
                options={this.state.filteredCategories} error={this.props.errors} />
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
                        <Table title='CATEGORIAS DE POSTAGENS' body={this.props.list} headComponent={this.renderTableHead()}
                        actions={{ remove: this.props.remove }} attributes={{ post_category: 'Categoria' }} renderHead={false} />
                    </form>
                </Content>
            </If>
        );
    }
}

FormCityUser = reduxForm({ form: 'menuPostCategoryForm', destroyOnUnmount: false })(FormCityUser)
const selector = formValueSelector('menuPostCategoryForm')
const mapStateToProps = state => ({
    post_category_id: selector(state, 'post_category_id'),
    parentId: state.form.menuForm.values.id,
    errors: state.menuPostCategory.errors,
    list: state.menuPostCategory.list,
    parentShow: state.menu.show
})
const mapDispatchToProps = dispatch => bindActionCreators({ 
    init, getList, remove }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(FormCityUser)