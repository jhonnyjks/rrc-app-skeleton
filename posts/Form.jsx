import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import LabelAndHTMLEditor from '../../common/form/LabelAndHTMLEditor'
import { init } from './duck'

class Form extends Component {

    constructor(props) {
        super(props)

        this.state = { post_categories: [], post: [] }
    }

    componentWillMount() {
        this.getPostCategories()
    }

    getPostCategories = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/post_categories`)
        .then(resp => {
            this.setState({ post_categories: resp.data.data })
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

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Postagens</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='title' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Título' cols='12 6' placeholder='Informe o título' error={this.props.errors} />
                            <Field name='post_category_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Categoria' cols='12 6' placeholder=' - Selecione - ' 
                                options={this.state.post_categories} error={this.props.errors} />
                            <Field name='content' component={LabelAndHTMLEditor} readOnly={this.props.readOnly}
                                label='Conteúdo' cols='12 12' error={this.props.errors} />
                                
                        </Row>
                    </div>
                    <div className='card-footer'>
                        <button type='submit' className={`btn btn-${this.props.submitClass}`}>{this.props.submitLabel}</button>
                        <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                    </div>
                </div>
            </form>
        )
    }
}

Form = reduxForm({ form: 'postForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('postForm')
const mapStateToProps = state => ({
    title: selector(state, 'title'),
    post_category_id: selector(state, 'post_category_id'),
    content: selector(state, 'content'),
    errors: state.post.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)