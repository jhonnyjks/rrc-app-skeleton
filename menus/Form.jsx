import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { toastr } from 'react-redux-toastr'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import { init } from './duck'

class Form extends Component {

    constructor(props) {
        super(props)

        this.state = { posts: [], menu: [] }
    }

    componentWillMount() {
        this.getMenus()
    }

    getMenus = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/menus`)
        .then(resp => {
            this.setState({ menu: resp.data.data })
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
                        <h3 className="card-title">Menu</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='title' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Título' cols='12 4' placeholder='Informe o título' error={this.props.errors} />
                            <Field name='subtitle' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Subtítulo' cols='12 4' placeholder='Informe o subtítulo' error={this.props.errors} />
                            <Field name='link' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Link' cols='12 4' placeholder='Informe o link' error={this.props.errors} />
                            <Field name='post_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Postagem relacionada' cols='12 4' placeholder=' - Selecione - ' 
                                options={this.state.menu} error={this.props.errors} />
                            <Field name='menu_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Menu pai' cols='12 4' placeholder=' - Selecione - ' 
                                options={this.state.menu} error={this.props.errors} />
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

Form = reduxForm({ form: 'menuForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('menuForm')
const mapStateToProps = state => ({
    title: selector(state, 'title'),
    subtitle: selector(state, 'subtitle'),
    link: selector(state, 'link'),
    post_id: selector(state, 'post_id'),
    menu_id: selector(state, 'menu_id'),
    errors: state.menu.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)