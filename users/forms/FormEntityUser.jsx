import React, { Component } from "react";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import axios from "axios";
import { toastr } from "react-redux-toastr";

import Row from "../../../common/layout/row";
import {
  init,
  create,
  getList,
  remove,
  showContent,
} from "../duck/entityUser.duck";
import LabelAndSelect from "../../../common/form/LabelAndSelect";
import If from "../../../common/operator/If";
import Table from "../../../common/layout/Table";
import Content from "../../../common/template/Content";
import Grid from "../../../common/layout/grid";

class FormEntityUser extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = { filteredUsers: [], profiles: [], entities: [] };
  }

  componentWillMount() {
    this.getProfiles();
    this.getEntities();
  }

  componentDidUpdate() {
    this.props.getList(this.props.parentId);
  }

  onSubmit(entityUser) {
    entityUser.user_id = this.props.parentId;
    this.props.create(entityUser);
  }

  getProfiles = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/user_profiles?search=user_id:${this.props.parentId}&with=profile:id,noun`
      )
      .then((resp) => {
        const profs =
          resp.data.data && resp.data.data.data
            ? resp.data.data.data
            : resp.data.data;
        this.setState({
          profiles: profs.map((e) =>
            e && e.profile ? { ...e.profile, name: e.profile.noun } : e
          ),
        });
      })
      .catch((e) => {
        if (!e.response) {
          toastr.error("Erro", "Desconhecido :-/");
          console.log(e);
        } else if (!e.response.data) {
          toastr.error("Erro", e.response.message);
        } else if (e.response.data) {
          toastr.error("Erro", e.response.data.message);
        }
      });
  };

  getEntities = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/entities?search=search=entity_type_id:17;general_status_id:1;programActions.general_status_id:1;programActions.programSubactions.general_status_id:1&searchFields=entity_type_id:=;general_status_id:=&searchJoin=and`)
      .then((resp) => {
        this.setState({
          entities:
            resp.data.data && resp.data.data.data
              ? resp.data.data.data
              : resp.data.data,
        });
      })
      .catch((e) => {
        if (!e.response) {
          toastr.error("Erro", "Desconhecido :-/");
          console.log(e);
        } else if (!e.response.data) {
          toastr.error("Erro", e.response.message);
        } else if (e.response.data) {
          toastr.error("Erro", e.response.data.message);
        }
      });
  };

  renderTableHead = () => {
    return (
      <Grid cols='12 12' >
        <Field
          name="entity_id"
          label='Selecione a Entidade'
          component={LabelAndSelect}
          readOnly={this.props.readOnly}
          cols="12 4"
          placeholder=" - Selecione a Entidade - "
          options={this.state.entities.map(e => ({...e, name: e.id + ' - ' +e.name})).filter( en => this.props.list.find(entity => entity.entity_id == en.id) == undefined)}
          error={this.props.errors}
          className='pull-left'
        />
        <Field
          name="profile_id"
          label="Selecione o Perfil"
          component={LabelAndSelect}
          readOnly={this.props.readOnly}
          cols="12 4"
          placeholder=" - Selecione o Perfil - "
          options={this.props.userProfiles.map(e => ({id: e.profile.id, name: e.profile.noun}))}
          error={this.props.errors}
          className='pull-left'
        />
        <Grid cols='12 3' className='pull-left' >
            <label style={{color:'#fff0', width:'100%'}}>-</label>
            <button type='submit' className={`btn btn-primary`} style={{height: 'min-content'}}>
                Adicionar
            </button>
        </Grid>
      </Grid>
    );
  };

  render() {
    return (
      <>
        <Content>
          <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Table
              body={this.props.list}
              headComponent={this.renderTableHead()}
              actions={{ remove: this.props.remove }}
              attributes={{
                entity: "Entidade",
                entity_id: {
                  title: "Tipo",
                  callback: (e, item) =>
                    item && item.entity && item.entity.entity_type
                      ? item && item.entity && item.entity.entity_type.name
                      : e,
                },
                profile: "Perfil",
              }}
            />
          </form>
        </Content>
      </>
    );
  }
}

FormEntityUser = reduxForm({ form: "entityUserForm", destroyOnUnmount: false })(
  FormEntityUser
);
const selector = formValueSelector("entityUserForm");
const mapStateToProps = (state) => ({
  entity_id: selector(state, "entity_id"),
  profile_id: selector(state, "profile_id"),
  errors:
    state.entityUser && state.entityUser.errors ? state.entityUser.errors : [],
  list: state.entityUser.list,
  show: state.entityUser.show,
  userProfiles: state.userProfile.list
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      init,
      create,
      getList,
      remove,
      showContent,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(FormEntityUser);
