import Dashboard from './dashboard/dashboard'

// Reducers do projeto
export const reducers = {
}

// Rotas do projeto
export const routes = [
    { exact: true, path: '/', component: Dashboard },
]

// Menu do projeto
export const menu = {
    '/': { title: 'Dashboard', icon: 'dashboard' },
    // 'profiles': {
    //     title: 'Perfis', icon: 'users',
        //Exemplo de menu cascateado
        // children: {
        //     '/permissions': { title: 'Permissões', icon: 'user' },
        // }
    // }
}