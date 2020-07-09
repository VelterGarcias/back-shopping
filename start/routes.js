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
}).prefix('admin')
//.middleware(['auth'])

Route.group(()=>{
  Route.resource('contacts', 'ContactController').apiOnly()
}).prefix('admin')
//.middleware(['auth'])

Route.group(()=>{
  Route.resource('shops', 'ShopController').apiOnly()
}).prefix('admin')
//.middleware(['auth'])

Route.get('/admin/shop/:email', 'ShopController.userShop')

Route.post('/auths', 'AuthController.store')

Route.get('/auths/profile','AuthController.profile')

Route.put('/admin/users/:id/uploads', 'UserController.changePhoto')
Route.get('/admin/users/:id/photo', 'UserController.photo')
//Route.get('/admin/users/where/:id', 'UserController.showWhere')

Route.get('/admin/shops/:id/photo', 'ShopController.logo')
Route.put('/admin/shops/:id/uploads', 'ShopController.changeLogo')
Route.put('/admin/shops/:id/uploads/:photoId', 'ShopController.changePhoto')
Route.get('/admin/shops/:id/photo/:photoId', 'ShopController.photo')
Route.delete('/admin/shops/:id/photo/:photoId', 'ShopController.deletePhoto')
Route.get('/admin/shops/where/:query', 'ShopController.showWhere')