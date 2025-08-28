import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TabsHeader from '../../../common/layout/tab/tabsHeader'
import { update, create } from '../duck/'
// import { update as updateModule, create as createModule } from '../duck/module.duck'
// import { update as updateActivity, create as createActivity } from '../duck/activity.duck'
// import { update as updateContent, create as createContent } from '../duck/content.duck'
// import { update as updateQuestion, create as createQuestion } from '../duck/question.duck'
// import { update as updateAlternative, create as createAlternative } from '../duck/alternative.duck'
// import { create as createentityProfile } from '../duck/entityProfile.duck'
// import { create as createentityCity } from '../duck/entityCity.duck'
import FormDefault from './FormDefault'
import FormEntityUser from './FormEntityUser'
// import {showContent as showContentDoc} from '../duck/document.duck'
// import FormActivity from './FormActivity'
// import FormContent from './FormContent'
// import FormQuestion from './FormQuestion'
// import FormAlternative from './FormAlternative'
// import FormentityProfile from './FormentityProfile'
// import FormentityCity from './FormentityCity'
import If from '../../../common/operator/If'
import Row from '../../../common/layout/row'
import Grid from '../../../common/layout/grid'
import { times } from 'lodash'

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            docFormOpened: false
        }
    }

    render() {
        return (
            <>
                <div className="card card-primary">
                    <TabsHeader>
                        <li className="nav-item">
                            <a id='homeNavLink' className={`nav-link active`} data-toggle="tab" href="#home">Entidade</a>
                        </li>
                        <li className="nav-item">
                            <a id='menu1NavLink' className={`nav-link ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu1">Membros</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu2">Histórico</a>
                        </li>
                        {/* <li className="nav-item">
                            <a className={`nav-link`} data-toggle="tab" href="#menu3">Tipos</a>
                        </li> */}
                        {/* <li className="nav-item">
                            <a className={`nav-link  ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu4">Questões</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link  ${this.props.isEdit ? `` : `disabled`}`} data-toggle="tab" href="#menu5">Alternativas</a>
                        </li> */}
                    </TabsHeader>
                    <div className='card-body'>
                        <div className="tab-content">
                            <div className="tab-pane container active" id="home">
                                <FormDefault onSubmit={this.props.isEdit ? this.props.update : this.props.create} submitClass='primary' />
                            </div>
                            <div className="tab-pane container fade" id="menu1">
                                <FormEntityUser submitClass='primary' />
                            </div>
                            <div className="tab-pane container fade" id="menu2">
                                {/* <FormContent submitLabel='Salvar' submitClass='primary'
                                    onCreate={this.props.createContent} onUpdate={this.props.updateContent} /> */}
                            </div>
                            {/* <div className="tab-pane container fade" id="menu3">
                                <FormEntityType submitClass='primary' />
                            </div> */}
                            {/* <div className="tab-pane container fade" id="menu4">
                                <FormQuestion submitLabel='Salvar' submitClass='primary'
                                    onCreate={this.props.createQuestion} onUpdate={this.props.updateQuestion} />
                            </div>
                            <div className="tab-pane container fade" id="menu5">
                                <FormAlternative submitLabel='Salvar' submitClass='primary'
                                    onCreate={this.props.createAlternative} onUpdate={this.props.updateAlternative} />
                            </div> */}

                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = state => ({
    isEdit: state.form.entityForm && state.form.entityForm.initial && state.form.entityForm.initial.id ? state.form.entityForm.initial.id : false,
    entity: state.form.entityForm
})

const mapDispatchToProps = dispatch => bindActionCreators({
    update, create
    // updateModule, createModule,
    // updateActivity, createActivity,
    // updateContent, createContent,
    // updateQuestion, createQuestion,
    // updateAlternative, createAlternative,
    // createentityProfile, createentityCity
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Form)