import Dashboard from './dashboard/dashboard'
import Menu from './menus/index'
import { menuReducer } from './menus/duck'
import { menuPostCategoryReducer } from './menus/menuPostCategory.duck'
import PostCategory from './post_categories/index'
import { postCategoryReducer } from './post_categories/duck'
import Banner from './banners/index'
import { bannerReducer } from './banners/duck'

// Reducers do projeto
export const reducers = {
    menu: menuReducer,
    postCategory: postCategoryReducer,
    menuPostCategory: menuPostCategoryReducer,
    banner: bannerReducer
}

// Rotas do projeto
export const routes = [
    { exact: true, path: '/', component: Dashboard },
    { exact: true, path: '/menus', component: Menu },
    { exact: true, path: '/post_categories', component: PostCategory },
    { exact: true, path: '/banners', component: Banner },
]

// Menu do projeto
export const menu = {
    '/': { title: 'Dashboard', icon: 'dashboard' },
    '/menus': { title: 'Menu', icon: 'book' },
    '/post_categories': { title: 'Categorias de posts', icon: 'book' },
    '/banners': { title: 'Banners', icon: 'book' },
    // 'profiles': {
    //     title: 'Perfis', icon: 'users',
        //Exemplo de menu cascateado
        // children: {
        //     '/permissions': { title: 'Permissões', icon: 'user' },
        // }
    // }
}