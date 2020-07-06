'use strict'

const Contact = use('App/Models/Contact')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contacts
 */
class ContactController {
  /**
   * Show a list of all contacts.
   * GET contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    return await Contact.all()
  }

  /**
   * Render a form to be used for creating a new contact.
   * GET contacts/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new contact.
   * POST contacts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const data = request.only(['name', 'phone','email', 'message', 'answered'])

    const contact = await Contact.create(data)

    return contact
  }

  /**
   * Display a single contact.
   * GET contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const contact = await Contact.findOrFail(params.id)

        return contact
  }

  /**
   * Render a form to update an existing contact.
   * GET contacts/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update contact details.
   * PUT or PATCH contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const contact = await Contact.findOrFail(params.id)

        const data = request.only(['name', 'phone','email', 'message', 'answered'])

        contact.merge(data)

        //executando no MySQL
        await contact.save()

        return contact
  }

  /**
   * Delete a contact with id.
   * DELETE contacts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const contact = await Contact.findOrFail(params.id)

        // if(user.id !== auth.user.id) {
        //     return response.status(401).send({error: 'Not authorized'})
        // }

        await contact.delete()
  }
}

module.exports = ContactController
