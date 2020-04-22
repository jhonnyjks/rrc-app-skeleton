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

    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Categorias de postagens</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='title' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Título' cols='12 4' placeholder='Informe o título' error={this.props.errors} />
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

Form = reduxForm({ form: 'postCategoryForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('postCategoryForm')
const mapStateToProps = state => ({
    title: selector(state, 'title'),
    errors: state.postCategory.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)