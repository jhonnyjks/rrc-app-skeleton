import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList } from './duck'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    render() {
        return (
            <Table body={this.props.list} actions={{update: true}}
            attributes={{id: 'ID', name: 'Nome', user: 'Supervisor', city_status: 'Situação'}} />
        )
    }
}

const mapStateToProps = state => ({ list: state.city.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)