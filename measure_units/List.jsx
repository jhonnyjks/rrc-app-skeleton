import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, remove } from './duck'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    render() {
        return (
            <Table body={this.props.list} actions={{update: true, remove: this.props.remove}}
            attributes={{name: 'Nome', initials: 'Sigla'}} />
        )
    }
}

const mapStateToProps = state => ({ list: state.measureUnit.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)