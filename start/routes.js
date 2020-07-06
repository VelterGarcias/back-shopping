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

Route.post('/admin/users/:id/uploads', 'UserController.changePhoto')
Route.get('/admin/users/:id/photo', 'UserController.photo')