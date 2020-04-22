import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentHeader from '../../common/template/ContentHeader'
import Content from '../../common/template/Content'
import If from '../../common/operator/If'
import List from './List'
import Row from '../../common/layout/row'
import Grid from '../../common/layout/grid'
import Form from './Form'
import { getList, showContent, update, init, create } from './duck'
import FormMenuPostCategory from './FormMenuPostCategory'
import { create as createMenuPostCategory } from './menuPostCategory.duck'

class Menu extends Component {

    componentWillMount() {
        this.props.init()
        this.props.getList()
    }

    render() {
        return (
            <div>
                <ContentHeader title='Menu' small='Itens'
                    createMethod={() => this.props.showContent('form')} />
                <Content>
                    <If test={this.props.show === 'list'}>
                        <List />
                    </If>
                    <If test={this.props.show === 'form'}>
                        <Form onSubmit={this.props.isEdit ? this.props.update : this.props.create}
                            submitLabel='Salvar' submitClass='primary' />
                        <If test={this.props.isEdit}>
                            <Row>
                                <Grid cols='12 12 12 6 6'>
                                    <FormMenuPostCategory submitLabel='Adicionar' submitClass='primary'
                                        onCreate={this.props.createMenuPostCategory} />
                                </Grid>
                            </Row>
                        </If>
                    </If>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    show: state.menu.show,
    isEdit: state.form.menuForm && state.form.menuForm.initial && state.form.menuForm.initial.id > 0
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getList, showContent, update, init, create, createMenuPostCategory
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Menu)