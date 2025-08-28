import React, { Component } from 'react';
import Content from '../../../common/template/Content'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, selectPermission, changeAttribute } from '../duck/userProfilePermissions.duck'
import CheckBox from '../../../common/form/CheckBox'
import Grid from '../../../common/layout/grid'
import If from '../../../common/operator/If'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Swal from 'sweetalert2';
import _ from 'lodash';

// Mapeando permissões específicas
const codesPerOpetarion = {
    1: [1, 3, 5, 7, 9, 11, 13, 15], //1-Read
    2: [2, 3, 6, 7, 10, 11, 14, 15], //2-Insert
    4: [4, 5, 6, 7, 12, 13, 14, 15], //4-Update
    8: [8, 9, 10, 11, 12, 13, 14, 15] //8-Delete
}

class FormUserProfilePermissions extends Component {

    constructor(props) {
        super(props);

        this.cancelar = this.cancelar.bind(this);
    }

    componentWillMount() {
        this.props.getList(this.props.profile);
    }

    isToCheck(operation, scope, i, scopes) {

        if (!Number.isInteger(scope.permission_id)) {
            if(codesPerOpetarion[operation].indexOf(scope.code) > -1 ) return 2
        }

        // Se for marcado pelo perfil, retorna true
        if(codesPerOpetarion[operation].indexOf(scope.code) > -1 ) return 1

        // Se não for marcado pelo perfil, buscando índice do escopo de mesmo nome
        const nextIndex = _.findIndex(scopes.slice(i+1), {noun: scope.noun})
        // console.log('nextIndex', nextIndex, scope.code, scopes[nextIndex+i+1].code)
            
        // Se existe outro escopo de mesmo nome, verifica se o código vai marcar o checkbox da vez
        if(nextIndex > -1 && codesPerOpetarion[operation].indexOf(scopes[nextIndex+i+1].code) > -1) {
            return 2
        }

        // Se chegou aqui, false
        return 0
    }

    hasPrev(scope, i, scopes) {
        // Encontre todos os índices de escopos com o mesmo nome (noun)
        const sameNounIndices = scopes
            .map((item, index) => (item.noun === scope.noun ? index : -1))
            .filter((index) => index !== -1);
    
        if (sameNounIndices.length > 1 && sameNounIndices[0] < i) {
            return true; // Se houver outro escopo com o mesmo nome anterior a este
        }
    
        return false;
    }
    

    handleCheckBoxChangeAction = (event, item, list) => {
        
        // Filtrar itens com o mesmo noun e permission_id não inteiro
        const filteredItems = list.filter(listItem => listItem.noun === item.noun && !Number.isInteger(listItem.permission_id));

        console.log(list);

        const newItem = {
            id: filteredItems.length > 0 ? filteredItems[0].id : null,
            cpath: this.props.list[this.props.selected].cpath,
            action: item.noun,
            user_profile_id: this.props.profile.id,
            code: filteredItems.length > 0 ? filteredItems[0].code : item.code,
            permission_id: item.permission_id,
        } 

        if (!event.target.checked) {
            if (event.target.style.accentColor === "green") {
                // console.log("O CheckBox está marcado (true)");
                this.props.changeAttribute(event, newItem, this.props.list[this.props.selected], 'atributo')
                this.props.getList(this.props.profile);
            } else {
                Swal.fire({ icon: 'warning', title: 'Atenção!', text: 'Não é possível alterar permissões definidas no perfil.'});
                return;
            }
        } else {
        //   console.log("O CheckBox está desmarcado (false)");
          this.props.changeAttribute(event, newItem, this.props.list[this.props.selected], 'atributo')
          this.props.getList(this.props.profile);
        }
        
    }

    handleCheckBoxChangeScope = (event, scope, scopes) => {

        console.log(scopes);

        // Filtrar itens com o mesmo noun e permission_id não inteiro
        const filteredScopes = scopes.filter(listScope => listScope.noun === scope.noun && !Number.isInteger(listScope.permission_id));

        const newScope = {
            id: filteredScopes.length > 0 ? filteredScopes[0].id : null,
            cpath: this.props.list[this.props.selected].cpath,
            scope: scope.noun,
            user_profile_id: this.props.profile.id,
            code: filteredScopes.length > 0 ? filteredScopes[0].code : scope.code,
            permission_id: scope.permission_id,
        } 

        if (!event.target.checked) {
            if (event.target.style.accentColor === "green") {
                // console.log("O CheckBox está marcado (true)");
                this.props.changeAttribute(event, newScope, this.props.list[this.props.selected], 'scope')
                this.props.getList(this.props.profile);
            } else {
                Swal.fire({ icon: 'warning', title: 'Atenção!', text: 'Não é possível alterar permissões definidas no perfil.'});
                return;
            }
        } else {
        //   console.log("O CheckBox está desmarcado (false)");
          this.props.changeAttribute(event, newScope, this.props.list[this.props.selected], 'scope')
          this.props.getList(this.props.profile);
        }
        
    }
      
    renderAttributes(list = []) {
        return list.map((item, i) => {
            // Se existe um escopo de mesmo nome numa posição anterior do array,
            // então pula esse para não repetir a linha na tabela 
            if(this.hasPrev(item, i, list)) return null 

            return (
                <div key={item.noun} className='row col-xs-12 col-md-12'>
                    <Grid cols='4 4 4'>
                        {item.noun}
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="1"
                            checked={this.isToCheck(1, item, i, list) > 0}
                            handleChange={event => this.handleCheckBoxChangeAction(event, item, list)}
                            style={{ accentColor: this.isToCheck(1, item, i, list) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="2"
                            checked={this.isToCheck(2, item, i, list) > 0}
                            handleChange={event => this.handleCheckBoxChangeAction(event, item, list)}
                            style={{ accentColor: this.isToCheck(2, item, i, list) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="4"
                            checked={this.isToCheck(4, item, i, list) > 0}
                            handleChange={event => this.handleCheckBoxChangeAction(event, item, list)}
                            style={{ accentColor: this.isToCheck(4, item, i, list) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="8"
                            checked={this.isToCheck(8, item, i, list) > 0}
                            handleChange={event => this.handleCheckBoxChangeAction(event, item, list)}
                            style={{ accentColor: this.isToCheck(8, item, i, list) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                </div>
            )
        })
    }
       

    renderScopes(scopes = []) {
        return scopes.map((scope, i) => { 
            // Se existe um escopo de mesmo nome numa posição anterior do array,
            // então pula esse para não repetir a linha na tabela 
            if(this.hasPrev(scope, i, scopes)) return null 

            return (
                <div key={scope.noun} className='row col-xs-12 col-md-12'>
                    <Grid cols='4 4 4'>
                        {scope.noun}
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="1"
                            checked={this.isToCheck(1, scope, i, scopes) > 0}
                            handleChange={event => this.handleCheckBoxChangeScope(event, scope, scopes)}
                            style={{ accentColor: this.isToCheck(1, scope, i, scopes) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="2"
                            checked={this.isToCheck(2, scope, i, scopes) > 0}
                            handleChange={event => this.handleCheckBoxChangeScope(event, scope, scopes)}
                            style={{ accentColor: this.isToCheck(2, scope, i, scopes) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="4"
                            checked={this.isToCheck(4, scope, i, scopes) > 0}
                            handleChange={event => this.handleCheckBoxChangeScope(event, scope, scopes)}
                            style={{ accentColor: this.isToCheck(4, scope, i, scopes) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                    <Grid cols='2 2 2'>
                        <CheckBox
                            value="8"
                            checked={this.isToCheck(8, scope, i, scopes) > 0}
                            handleChange={event => this.handleCheckBoxChangeScope(event, scope, scopes)}
                            style={{ accentColor: this.isToCheck(8, scope, i, scopes) == 2 ? 'green' : '' }}
                        />
                    </Grid>
                </div>
            )
        })
    }

    renderRows() {
        const list = this.props.list || []

        return list.map((item, index) => (
            <li key={item.cpath} className='list-group-item col-xs-12'>
                <a href="#!" className='row col-xs-12' onClick={(e) => this.props.selectPermission(e, index)}>
                    <b>{item.cpath}</b>
                </a>
                <If test={index === this.props.selected}>
                    <Tabs
                        defaultActiveKey="atributo"
                        id="permissoes-atributos-scopes"
                    >
                        <Tab eventKey="atributo" title="Atributo" className='bg-white'>
                            <div className='row col-xs-12 col-md-12'>
                                <b className='tex-center col-xs-4 col-md-4'></b>
                                <b className='tex-center col-xs-2 col-md-2'>Visualizar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Adicionar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Editar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Remover</b>
                            </div>
                            {this.renderAttributes(item.actions)}
                        </Tab>
                        <Tab eventKey="scopes" title="Scopes" className='bg-white'>
                            <div className='row col-xs-12 col-md-12'>
                                <b className='tex-center col-xs-4 col-md-4'></b>
                                <b className='tex-center col-xs-2 col-md-2'>Visualizar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Adicionar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Editar</b>
                                <b className='tex-center col-xs-2 col-md-2'>Remover</b>
                            </div>
                            {this.renderScopes(item.scopes)}
                        </Tab>
                    </Tabs>
                </If>
            </li>
        ))
    }

    cancelar = () => {
        this.props.onCancel();
    }
    
    render() {
        return (
            <div>
                <Content>
                    <div className='card card-primary'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col-xs-12 col-sm-6'>
                                    <p className='mt-1' style={{ fontWeight: 'bolder' }}>Editando Permissões do Perfil {this.props.profile.profile.noun}</p>
                                </div>
                                <div className='col-xs-12 col-sm-6 text-right'>
                                    <button className="btn btn-default" onClick={this.cancelar}>Cancelar</button>
                                </div>
                            </div>
                        </div>

                        <div className='panel panel-default'>
                            <ul className='list-group custom-list-group'>
                                {this.renderRows()}
                            </ul>
                        </div>
                    </div>
                </Content>
            </div>
        );
    }

}

const mapStateToProps = state => ({ 
    list: state.permission.list, 
    selected: state.permission.selected 
})
const mapDispatchToProps = dispatch => bindActionCreators({
    getList,
    selectPermission,
    changeAttribute
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FormUserProfilePermissions)
