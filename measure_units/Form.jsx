import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import { init, create, update } from './duck'
import BackButton from '../../common/form/BackButton'
import SubmitButton from '../../common/form/SubmitButton'

class Form extends Component {

    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this)
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
                        <h3 className="card-title">Unidades de Medida</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='name' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Nome' cols='12 4' placeholder='Informe o nome' error={this.props.errors} />
                            <Field name='initials' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Sigla' cols='12 4' placeholder='Ex.: cm, mm...' error={this.props.errors} />
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

Form = reduxForm({ form: 'measureUnitForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('measureUnitForm')
const mapStateToProps = state => ({
    name: selector(state, 'name'),
    initials: selector(state, 'initials'),
    errors: state.measureUnit.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)