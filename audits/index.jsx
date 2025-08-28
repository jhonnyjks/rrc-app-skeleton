import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Form from './Form'
import { getList, update, init, create } from './duck'

class Audit extends Component {

    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }
    
    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id || prevProps.list !== this.props.list) {
            const itemId = this.props.match.params.id
            if (itemId == 0) {
                this.props.init()
            } else if (itemId && this.props.list.length > 0 && !this.props.isEdit) {
                const item = _.find(this.props.list, ['id', Number.parseInt(itemId)])
                if (item) {
                    this.props.init(item)
                }
            }
        }
    }


    render() {

        if(this.props.match.params.id > 0 && this.props.list.length > 0 && this.props.isEdit === false) {
            const item = _.find(this.props.list, ['id', Number.parseInt(this.props.match.params.id)])            
            if(item) {
                this.props.init(item)
            }
        }


        const itemName = this.props.auditFormName;
        const pathname = this.context.router.route.location.pathname
        const itemId = this.props.match.params.id
        return (
            <div>
                <ContentHeader 
                    title="Auditoria" 
                    small=' Gerenciar'
                />
                 <Content>
                    { (typeof itemId === 'undefined') &&
                        <List />
                    }
                    { (typeof itemId !== 'undefined') &&
                        <Form submitLabel='Salvar' submitClass='primary' />
                    }
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.audit.show,
    isEdit: state.form.auditForm && state.form.auditForm.initial && state.form.auditForm.initial.id ? state.form.auditForm.initial.id : false,
    list: state.audit.list,
    auditFormName: state.form.auditForm && state.form.auditForm.values ? state.form.auditForm.values.name : '',
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, update, init, create
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Audit)
