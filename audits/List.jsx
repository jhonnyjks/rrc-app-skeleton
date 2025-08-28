import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, remove, getListExcel } from './duck'
import Table from '../../common/layout/Table'

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        this.props.getList();
        this.props.getListExcel();
    }

    render() {

        return <>
            <Table 
                body={this.props.list} 
                actions={{ update: true, remove: false, }}
                pagination={this.props.pagination}
                attributesSearch={this.props.getList}
                onExport={this.props.getListExcel}
                attributes={{
                    event: { 
                        title: 'Evento',
                        search: { field: 'event', type: 'text' },
                    }, 
                    item_type: { 
                        title: 'Tipo de item',
                        search: { field: 'item_type', type: 'text' },
                    }, 
                    item_id: { 
                        title: 'ID do item',
                        search: { field: 'item_id', type: 'text' },
                    }, 
                    ipv4: { 
                        title: 'Ip',
                        search: { field: 'ipv4', type: 'text' },
                    },
                    'user.name': { 
                        title: 'Usuário',
                        search: { field: 'user.name', type: 'text' },
                    },
                    'created_at': { 
                        title: 'Data',
                        callback: e => new Date(e).toLocaleString(),
                        search: { field: 'created_at', type: 'date' },
                    },
                }} 
            />
        </>
    }
}

const mapStateToProps = state => ({
    list: state.audit.list,
    pagination: state.audit.pagination
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, remove, getListExcel }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)