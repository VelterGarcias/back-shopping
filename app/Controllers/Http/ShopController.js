'use strict'

const Shop = use('App/Models/Shop')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with shops
 */
class ShopController {
  /**
   * Show a list of all shops.
   * GET shops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index (request) {
    return await Shop.all()
  }

  /**
   * Render a form to be used for creating a new shop.
   * GET shops/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new shop.
   * POST shops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const data = request.only(['name', 'description','category', 'adress', 'phone', 'smartphone', 'whatsapp', 'website', 'facebook', 'instagram', 'admin_mail', 'logo', 'photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6', 'isOnline'])

    const shop = await Shop.create(data)

    return shop
  }

  /**
   * Display a single shop.
   * GET shops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    
    const shop = await Shop.findOrFail(params.id)

        return shop
  }

  /**
   * Render a form to update an existing shop.
   * GET shops/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update shop details.
   * PUT or PATCH shops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const shop = await Shop.findOrFail(params.id)

        const data = request.only(['name', 'description','category', 'adress', 'phone', 'smartphone', 'whatsapp', 'website', 'facebook', 'instagram', 'admin_mail', 'logo', 'photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6', 'isOnline'])

        shop.merge(data)

        //executando no MySQL
        await shop.save()

        return shop
  }

  /**
   * Delete a shop with id.
   * DELETE shops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const shop = await Shop.findOrFail(params.id)

        // if(user.id !== auth.user.id) {
        //     return response.status(401).send({error: 'Not authorized'})
        // }

        await shop.delete()
  }

  async userShop ({ params, request, response }) {

      const shop = await Shop.findByOrFail('admin_mail', params.email )

        // if(user.id !== auth.user.id) {
        //     return response.status(401).send({error: 'Not authorized'})
        // }

        return shop
        //return shop 
  }

  

}

module.exports = ShopController