import Dashboard from './dashboard/dashboard'
import User from '../users/index'
import Profile from '../profiles/index'

// Reducers do projeto
export const reducers = {

}

// Rotas do projeto
export const routes = [
    { exact: true, path: '/', component: Dashboard },
    { exact: true, path: '/users', component: User },
    { exact: true, path: '/profiles', component: Profile }
]

// Menu do projeto
export const menu = {
    '/': { title: 'Dashboard', icon: 'dashboard' },
    '/users': { title: 'Usuários', icon: 'user' },
    'profiles': {
        title: 'Perfis', icon: 'users',
        //Exemplo de menu cascateado
        // children: {
        //     '/permissions': { title: 'Permissões', icon: 'user' },
        // }
    }
}