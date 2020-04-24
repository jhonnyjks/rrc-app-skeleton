import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove } from './duck'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    render() {
        return (
            <Table body={this.props.list} actions={{update: this.props.showUpdate, remove: this.props.remove}}
            attributes={{title: 'Título', post_category: 'Categoria'}} />
        )
    }
}

const mapStateToProps = state => ({ list: state.post.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)