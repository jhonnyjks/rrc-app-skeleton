import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, remove } from './duck'
import Table from '../../common/layout/Table';

import axios from 'axios'
import { toastr } from 'react-redux-toastr'

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entityTypes: [], 
            generalStatuses: [],
        }
    }

    componentWillMount() {
        this.props.getList();
        this.getGeneralStatuses();
        this.getEntityTypes();
    }

    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/general_statuses`)
            .then(resp => {
                this.setState({ generalStatuses: resp.data.data })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Não foi possível recarregar a lista de status de entidades.')
                    console.log(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }


    getEntityTypes = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/entity_types`)
            .then(resp => {
                this.setState({ entityTypes: resp.data.data.data })
            })
            .catch(e => {
                if (!e.response) {
                    toastr.error('Erro', 'Desconhecido :-/')
                    console.log(e)
                } else if (!e.response.data) {
                    toastr.error('Erro', e.response.message)
                } else if (e.response.data) {
                    toastr.error('Erro', e.response.data.message)
                }
            })
    }

    render() {

        return (
            <Table
                body={this.props.list}
                actions={{update: true, remove: this.props.remove}}
                pagination={this.props.pagination}
                attributesSearch={this.props.getList}
                attributes={{

                    name: {
                        title: 'Nome',
                        search: { field: 'name', type: 'text' },
                        callback: function(e) { return e; }
                    },

                    initials: {
                        title: 'Sigla',
                        search: { field: 'initials', type: 'text' },
                        callback: function(e) { return e; }
                    },

                    entity_type: {
                        title: 'Tipo',
                        search: { field: 'entity_type_id', list: this.state.entityTypes.map( e => ({value: e.id, label: e.name}))},
                        callback: (e) => e ? <div title={e.name}>{e.name}</div> : '---' 
                    },

                    entity: {
                        title: 'Mãe',
                        search: { field: 'entity_id', list: this.props.entities.map( e => ({value: e.id, label: e.name}))},
                        callback: (e) => e ? <div title={e.name}>{e.name}</div> : '---' 
                    },

                    general_status: {
                        title: 'Status',
                        search: { field: 'general_status_id', list: this.state.generalStatuses.map( e => ({value: e.id, label: e.name}))},
                        callback: (e) => e ? <div title={e.name}>{e.name}</div> : '---' 
                    },
                }}
            />
        )
    }
}

const mapStateToProps = state => ({ 
    list: state.entity.list,
    entities: state.entity.list,
    pagination: state.entity.pagination
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)