import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TabsHeader from '../../../common/layout/tab/tabsHeader'
import { update } from '../duck'
import FormDefault from './FormDefault'
import FormUserProfile from './FormUserProfile'
import FormEntityUser from './FormEntityUser'
import { create as createUserProfile } from '../duck/userProfile.duck'
import Log from '../../audits/Log'

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            docFormOpened: false
        }
    }

    render() {
        const itemId = this.props.user.id;

        return (
            <>
                <div className="card card-primary">
                    <TabsHeader>
                        <li className="nav-item">
                            <a id='homeNavLink' className={`nav-link active`} data-toggle="tab" href="#home">Usuário</a>
                        </li>
                        <li className="nav-item">
                            <a id='menu1NavLink' className={`nav-link ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu1">Perfis</a>
                        </li>
                        <li className="nav-item">
                            <a id='menu3NavLink' className={`nav-link ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu3">Entidades</a>
                        </li>
                        <li className="nav-item">
                            <a id='menu2NavLink' className={`nav-link ${this.state.abaTimeline ? 'active' : ''} ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu2" onClick={() => this.setState({ flowGetFocus: true })}>Histórico</a>
                        </li>
                    </TabsHeader>
                    <div className='card-body'>
                        <div className="tab-content">
                            <div className="tab-pane container active" id="home">
                                <FormDefault />
                            </div>
                            <div className="tab-pane container fade" id="menu1">
                                <FormUserProfile submitLabel='Adicionar' submitClass='primary'
                                    onCreate={this.props.createUserProfile} />
                            </div>
                            <div className="tab-pane container fade" id="menu3">
                                <FormEntityUser parentId={itemId} />
                            </div>
                            <div className={`tab-pane container ${this.state.abaTimeline ? 'active' : ''}`} id="menu2">
                                {
                                    itemId && (<Log item_type="User" item_id={itemId}></Log>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = state => ({
    isEdit: state.form.userForm && state.form.userForm.initial && state.form.userForm.initial.id ? state.form.userForm.initial.id : false,
    user: state.form.userForm && state.form.userForm.initial ? state.form.userForm.initial : false,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    update, createUserProfile
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)