import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import LabelAndSelect from '../../common/form/LabelAndSelect'
import { init } from './duck'

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.getBase64 = this.getBase64.bind(this)
    }

    getBase64 = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        var self = this
        reader.onload = function () {
            self.setState({ file: file.name + 'extension' + reader.result})
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
            self.setState({ file: null })
        };
    }

    onChangeHandler = event => {
        this.getBase64(event.target.files[0])
        event.target.nextElementSibling.innerText = event.target.files[0].name
    }

    onSubmit(item) {
        item.img = this.state.file
        this.props.onSubmit(item)
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Banners</h3>
                    </div>
                    <div className='card-body'>
                        <Row>
                            <Field name='title' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Título' cols='12 6' placeholder='Informe o título' error={this.props.errors} />
                            <div className="col-xs-12 col-sm-6">
                                <label>Imagem</label>
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" onChange={this.onChangeHandler}/>
                                    <label className="custom-file-label" htmlFor="customFile">
                                        { this.props.img || 'Procurar arquivo...'}
                                    </label>
                                </div>
                            </div>
                            <Field name='link' component={LabelAndInput} readOnly={this.props.readOnly}
                                label='Link' cols='12 6' placeholder='Informe o link' error={this.props.errors} />
                            <Field name='post_id' component={LabelAndSelect} readOnly={this.props.readOnly}
                                label='Postagem relacionada' cols='12 6' placeholder=' - Selecione - ' 
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

Form = reduxForm({ form: 'bannerForm', destroyOnUnmount: false })(Form)
const selector = formValueSelector('bannerForm')
const mapStateToProps = state => ({
    title: selector(state, 'title'),
    link: selector(state, 'link'),
    post_id: selector(state, 'post_id'),
    errors: state.banner.errors
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)