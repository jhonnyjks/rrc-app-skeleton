import Dashboard from './dashboard/dashboard'
import City from './cities'
import { cityReducer } from './cities/duck'
import { cityUserReducer } from './cities/cityUser.duck'
import User from './users'
import { userReducer } from './users/duck'
import UserPosition from './user_positions'
import { userPositionReducer } from './user_positions/duck'
import MeasureUnit from './measure_units'
import { measureUnitReducer } from './measure_units/duck'
import Entity from './entities'
import { entityReducer } from './entities/duck'
import { entityUserReducer } from './entities/duck/entityUser.duck'
import ChangeProfile from '../default/profiles/index'
import Profile from './profiles'
import EntityType from './entity_types'
import { entityTypeReducer } from './entity_types/duck'
import Audit from './audits'
import { auditReducer } from './audits/duck'

// Reducers do projeto
export const reducers = {
  city: cityReducer,
  cityUser: cityUserReducer,
  audit: auditReducer,
  user: userReducer,
  userPosition: userPositionReducer,
  measureUnit: measureUnitReducer,
  entity: entityReducer,
  entityType: entityTypeReducer,
  entityUser: entityUserReducer
}

// Rotas do projeto
export const routes = [
  { exact: true, path: '/', component: Dashboard },
  { exact: true, path: '/users', component: User },
  { exact: true, path: '/profiles', component: Profile },
  { exact: true, path: '/cities', component: City },
  { exact: true, path: '/entities', component: Entity },
  { exact: true, path: '/audits', component: Audit },
  { exact: true, path: '/user_positions', component: UserPosition },
  { exact: true, path: '/measure_units', component: MeasureUnit },
  { exact: true, path: '/trocar-perfil', component: ChangeProfile },
  { exact: true, path: '/entity_types', component: EntityType }
]

// Menu do projeto
export const menu = {
  '/': { title: 'Início', icon: 'home', excludeFromProfiles: [2] },
  '/profiles': {
    title: 'Perfis',
    icon: 'lock',
    excludeFromProfiles: [2, 3, 4, 5, 6, 7]
  },
  '/users': {
    title: 'Usuários',
    icon: 'user',
    excludeFromProfiles: [2, 3, 4, 5, 6, 7]
  },
  '/defs': {
    title: 'Definições',
    icon: 'gears',
    fixed: true,
    children: {
      '/entities': {
        title: 'Entidades',
        icon: 'users',
        excludeFromProfiles: [2, 3, 4, 5, 6, 7]
      },
      '/entity_types': { title: 'Tipos de entidade', icon: 'book' },
      '/audits': { title: 'Auditoria', icon: 'table' }
    },
    excludeFromProfiles: [2, 3, 4, 5, 6, 7]
  }
}
