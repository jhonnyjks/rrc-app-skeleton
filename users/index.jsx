import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import List from './List'
import Form from './forms'
// import FormUserProfile from './FormUserProfile'
import { getList, init } from './duck'
import { create as createUserProfile } from './duck/userProfile.duck'

class User extends Component {

    //Necessário para gerar o contexto em this.context
    static contextTypes = {
        router: () => null, // replace with PropTypes.object if you use them
    }
    
    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    render() {
        if(this.props.match.params.id == 0) {
            this.props.init()
        } else if(this.props.match.params.id && this.props.list.length > 0 && this.props.isEdit === false) {
            
            const item = _.find(this.props.list, ['id', Number.parseInt(this.props.match.params.id)])
            
            if(item) {
                this.props.init(item)
            }
        }

        const pathname = this.context.router.route.location.pathname
        const itemId = this.props.match.params.id
        return (
            <div>
                <ContentHeader title={'Usuários' + (itemId > 0 ? ' - Editando ' + itemId : '') + (itemId == 0 ? ' - Cadastrar Novo ' : '')} small='Gerenciar usuários'
                    createMethod={
                        typeof itemId === 'undefined' ? 
                        () => this.context.router.history.push(pathname + (pathname[pathname.length-1] == '/' ? '' : '/') + '0') :
                        null
                    } />
                <Content>
                    { (typeof itemId === 'undefined') &&
                        <List />
                    }
                    { (typeof itemId !== 'undefined') &&
                        <Form submitLabel='Salvar' submitClass='primary'/>
                    }
                    
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.user.show,
    isEdit: state.form.userForm && state.form.userForm.initial && state.form.userForm.initial.id ? state.form.userForm.initial.id : false,
    list: state.user.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, init, createUserProfile
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(User)