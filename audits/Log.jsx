import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Table from '../../common/layout/Table';
import { getList } from './duck';

class Log extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
        
        this.params = `&search=item_type:App\\Models\\${this.props.item_type};item_id:${this.props.item_id};`
    }

    componentWillMount() {
        this.props.getList(this.params);
    }

    list(search){
        let params = this.params;
        var texto = search.replace('search=',params)
        this.props.getList(texto);
    }

    render(){
        return (
            <>
                <Table 
                    body={this.props.list}            
                    actions={{update: false, remove: false}} 
                    pagination={this.props.pagination}
                    attributesSearch={this.list.bind(this)}
                    attributes={{
                        id:{
                            title:'Id',
                            search: { field: 'id', type: 'text' },
                        },
                        event: { 
                            title: 'Evento',
                            search: { field: 'event', type: 'text' },
                        }, 
                        created_at:{ 
                            title: 'Data',
                            callback: e => new Date(e).toLocaleString(),
                            search: { field: 'created_at', type: 'date' },
                        },
                        'user.name': { 
                            title: 'Usuário',
                            search: { field: 'user.name', type: 'text' },
                        },
                    }}
                ></Table>
            </>
        );
    }
}

const mapStateToProps = state => ({
    list: state.audit.list,
    pagination: state.audit.pagination,
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, }, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Log)