import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, remove } from './duck'
import Table from '../../common/layout/Table';
import Swal from 'sweetalert2';
import axios from 'axios';

class List extends Component {

    constructor(props) {
        super(props)
        this.state = { generalStatuses: [] }
        this.getGeneralStatuses()
        
    }

    componentWillMount() {
        this.props.getList();
    }

    handleRemove(id) {
        Swal.fire({
            title: 'Alerta',
            text: 'Deseja prosseguir com esta ação?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.remove(id);
            }
        });
    }

    getGeneralStatuses = () => {
        axios.get(`${process.env.REACT_APP_API_HOST}/general_statuses`)
        .then(resp => {
            this.setState({ generalStatuses: resp.data.data })            
        })
        .catch(e => {
            if (!e.response) {
                console.log(e)
            } 
        })
    }

    render() {
        return (
            <Table 
                body={this.props.list} 
                actions={{update: true, remove: this.handleRemove.bind(this)}}
                pagination={this.props.pagination}
                attributesSearch={this.props.getList}
                attributes={{

                    login: {
                        title:'Login',
                        search: { field: 'login', type: 'text' },
                    }, 
                    name: {
                        title:'Nome',
                        search: { field: 'name', type: 'text' },
                    }, 
                    email: {
                        title:'E-mail',
                        search: { field: 'email', type: 'text' },
                    }, 

                    auth_type_id: {
                        title: 'Tipo de Autenticação',
                        callback: (e, item) => {
                            console.log(e)
                            if(e == 1){
                                return 'Sistema';
                            }
                            else if(e == 2){
                                return 'LDAP';
                            }else{
                                return '---'
                            }
                        },
                        search: { field: 'auth_type_id', list: [
                            {value: '1', label: 'Sistema'},
                            {value: '2', label: 'LDAP'}
                        ] },
                    },
                    general_status: {
                        title: 'Status',
                        search: { field: 'general_status_id', list: this.state.generalStatuses.map(({id,name}) => ({value:id,label:name}))  },
                    }
                }} />
        )
    }
}

const mapStateToProps = state => ({ 
    list: state.user.list,
    pagination: state.user.pagination
 })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)