import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TabsHeader from '../../../common/layout/tab/tabsHeader'
import FormDefault from './FormDefault'
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
                            <a id='homeNavLink' className={`nav-link active`} data-toggle="tab" href="#home">Perfil</a>
                        </li>
                        <li className="nav-item">
                            <a id='menu1NavLink' className={`nav-link ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu1">Histórico</a>
                        </li>
                    </TabsHeader>
                    <div className='card-body'>
                        <div className="tab-content">
                            <div className="tab-pane container active" id="home">
                                <FormDefault />
                            </div>
                            <div className="tab-pane container fade" id="menu1">
                                {
                                    itemId && (<Log item_type="Profile" item_id={itemId}></Log>)
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
    isEdit: state.form.profileForm && state.form.profileForm.initial && state.form.profileForm.initial.id ? state.form.profileForm.initial.id : false,
    user: state.form.profileForm && state.form.profileForm.initial ? state.form.profileForm.initial : false,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)