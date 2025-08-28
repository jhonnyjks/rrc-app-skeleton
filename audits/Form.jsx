import React, { Component } from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Row from '../../common/layout/row'
import LabelAndInput from '../../common/form/LabelAndInput'
import { init, create, update } from './duck'
import BackButton from '../../common/form/BackButton'
import Table from '../../common/layout/Table'

class Form extends Component {

    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }

        this.editor = null;

        this.getEditorRef = this.getEditorRef.bind(this)
    }

    showDocument(e,content){
        if(this.state.content){
            this.setState({ content: '' });
        }else{
            this.setState({ content: content });
        }
    }

    getEditorRef(s, e) {
        this.editor = s
    }

    render() {
        let dataJson = this.props.data
        
        let dataLista = [];
        if(dataJson){
            Object.entries(dataJson).forEach(([chave,valor]) => {
                dataLista.push({chave,valor})
            });
    
        }
        
        return (
            < >
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Adicionar modelo de documento</h3>
                    </div>
                    <div className='card-body'>
                    <Row>
                            <Field 
                                name='event' 
                                component={LabelAndInput} 
                                readOnly={true}
                                label='Evento' 
                                cols='12 4'   
                            />
                            <Field 
                                name='item_type' 
                                component={LabelAndInput} 
                                readOnly={true}
                                label='Item' 
                                cols='12 4'   
                            />
                            <Field 
                                name='item_id' 
                                component={LabelAndInput} 
                                readOnly={true}
                                label='Id do item' 
                                cols='12 4'   
                            />
                            <Field 
                                name='ipv4' 
                                component={LabelAndInput} 
                                readOnly={true} 
                                label='IP'
                                cols='12 4' 
                            />
                            <Field 
                                name='ipv4'
                                component={LabelAndInput} 
                                readOnly={true} 
                                label='Usuário'
                                cols='12 4' 
                                val={this.props.user?this.props.user.name:''}
                            />
                            <Field 
                                name='ipv4'
                                component={LabelAndInput} 
                                readOnly={true} 
                                label='Data de criação'
                                cols='12 4' 
                                val={this.props.created_at?new Date(this.props.created_at).toLocaleString():''}
                            />
                             <Table 
                                body={dataLista} 
                                attributes={{
                                    chave:'Chave',
                                    valor:{
                                        title:'Valor',
                                        callback: (e,item) => {
                                            let conteudo = e.substring(0,120) + '...'
                                            return conteudo
                                        }
                                    },
                                }}
                            />
                               
                        </Row>
                    </div>
                    <div className='card-footer d-flex justify-content-between'>
                        <BackButton className="ml-auto" label='Cancelar' />
                    </div>
                </div>
            </>
        )
    }
}

Form = reduxForm({ form: 'auditForm', destroyOnUnmount: true })(Form)
const selector = formValueSelector('auditForm')
const mapStateToProps = state => ({
    event: selector(state, 'event'),
    item_type: selector(state, 'item_type'),
    item_id: selector(state, 'item_id'),
    data: selector(state, 'data'),
    ipv4: selector(state, 'ipv4'),
    user: selector(state, 'user'),
    created_at: selector(state, 'created_at'),
    errors: state.audit.errors,
})
const mapDispatchToProps = dispatch => bindActionCreators({ init, create, update }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)