'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(()=>{
  Route.resource('users', 'UserController').apiOnly()
}).prefix('admin').middleware(['auth'])
//rotas adicionais para Users
Route.put('/admin/users/:id/uploads', 'UserController.changePhoto').middleware(['auth'])
Route.get('/admin/users/:id/photo', 'UserController.photo')
Route.post('/admin/user', 'UserController.newUser')

Route.group(()=>{
  Route.resource('contacts', 'ContactController').apiOnly()
}).prefix('admin').middleware(['auth'])
//rota adicional pra salvar mensagem sem ter token
Route.post('/admin/contact', 'ContactController.newContact')

//Pra gerar um token para o User quando ele faz login
Route.post('/auths', 'AuthController.store')
//pra "pegar" o User pelo token salvo (serve pra direcionar automaticamente no Admin)
Route.get('/auths/profile','AuthController.profile')

//rotas para shops
Route.get('/admin/shops', 'ShopController.index')
Route.get('/admin/shops/:id', 'ShopController.show')
Route.post('/admin/shops', 'ShopController.store').middleware(['auth'])
Route.delete('/admin/shops/:id', 'ShopController.destroy').middleware(['auth'])
Route.put('/admin/shops/:id', 'ShopController.update').middleware(['auth'])
Route.get('/admin/shops/:id/photo', 'ShopController.logo')
Route.put('/admin/shops/:id/uploads', 'ShopController.changeLogo').middleware(['auth'])
Route.put('/admin/shops/:id/uploads/:photoId', 'ShopController.changePhoto').middleware(['auth'])
Route.get('/admin/shops/:id/photo/:photoId', 'ShopController.photo')
Route.delete('/admin/shops/:id/photo/:photoId', 'ShopController.deletePhoto').middleware(['auth'])
Route.get('/admin/shops/where/:query', 'ShopController.showWhere')
//Pra buscar a loja que o User tem permissão de editar
Route.get('/admin/shop/:email', 'ShopController.userShop').middleware(['auth'])

//rotas para Cinema
Route.get('/admin/cinema', 'CinemaController.index')
Route.get('/admin/cinema/:id', 'CinemaController.show')
Route.post('/admin/cinema', 'CinemaController.store').middleware(['auth'])
Route.delete('/admin/cinema/:id', 'CinemaController.destroy').middleware(['auth'])
Route.put('/admin/cinema/:id', 'CinemaController.update').middleware(['auth'])
Route.get('/admin/cinema/:id/photo', 'CinemaController.poster')
Route.put('/admin/cinema/:id/uploads', 'CinemaController.changePoster')
// .middleware(['auth'])
Route.delete('/admin/cinema/:id/photo/:photoId', 'CinemaController.deletePoster').middleware(['auth'])
Route.get('/admin/cinema/where/:query', 'CinemaController.showWhere')