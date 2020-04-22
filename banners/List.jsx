import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, remove } from './duck'
import Table from '../../common/layout/Table';

class List extends Component {

    componentWillMount() {
        this.props.getList();
    }

    createFileLink = (file) => {
        return <a target='_blank' href={process.env.REACT_APP_API_HOST+'/../files/banners/'+file}>{file}</a>
    }

    render() {
        return (
            <Table body={this.props.list} actions={{update: this.props.showUpdate, remove: this.props.remove}}
            attributes={{title: 'Título', img: { title: 'Foto', callback: this.createFileLink }, post_id: 'Post', link: 'Link'}} />
        )
    }
}

const mapStateToProps = state => ({ list: state.banner.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, remove }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List)