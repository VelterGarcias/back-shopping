'use strict'

const Cinema = use('App/Models/Cinema')
// const Helpers = use('Helpers')
// const fs = use('fs')
// const readFile = Helpers.promisify(fs.readFile)
// const deleteFile = Helpers.promisify(fs.unlink)
// const uploadDir = 'uploads/cinema'
const Drive = use('Drive')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cinemas
 */
class CinemaController {
  /**
   * Show a list of all cinemas.
   * GET cinemas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return await Cinema.all()
  }

  /**
   * Render a form to be used for creating a new cinema.
   * GET cinemas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new cinema.
   * POST cinemas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['name', 'photo','category', 'sub_category', 'description', 'age', 'language', 'isOnline'])

    const cinema = await Cinema.create(data)

    return cinema
  }

  /**
   * Display a single cinema.
   * GET cinemas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const cinema = await Cinema.findOrFail(params.id)

    return cinema
  }

  /**
   * Render a form to update an existing cinema.
   * GET cinemas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update cinema details.
   * PUT or PATCH cinemas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const cinema = await Cinema.findOrFail(params.id)

    const data = request.only(['name', 'photo','category', 'sub_category', 'description', 'age', 'language', 'isOnline'])

    cinema.merge(data)

    //executando no MySQL
    await cinema.save()

    return cinema
  }

  /**
   * Delete a cinema with id.
   * DELETE cinemas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const cinema = await Cinema.findOrFail(params.id)

      // if(user.id !== auth.user.id) {
      //     return response.status(401).send({error: 'Not authorized'})
      // }

    await cinema.delete()
  }

  
  async changePoster({params, request, response}) {

    const cinema = await Cinema.findOrFail(params.id)
        const folder = 'uploads';
        
        request.multipart.file('file', {
            size: '1mb',
            extnames: ['jpg', 'png', 'webP', 'jpeg'] 
        }, async file => {
        await Drive.put(`${folder}/cinema/${params.id}/poster`, file.stream, {
            ACL: 'public-read',
            ContentType: `${file.type}/${file.subtype}`,
        });
        });

        await request.multipart.process();

        cinema.photo = `poster`

        await cinema.save()

        return cinema
  }

  async poster({params, response}) {

    const cinema = await Cinema.findOrFail(params.id)
    const folder = `uploads/cinema/${params.id}`;

    const exists = await Drive.exists(`${folder}/poster`)
    if (exists) {
        response.implicitEnd = false
        response.header('Content-type', 'image/*')

        const stream = await Drive.getStream(`${folder}/poster`)

        stream.pipe(response.response)
    } else {
        return response.status(400).json({'error': "O parâmetro informado não existe"})
    }
  }

  async showWhere({ params }) {
    //console.log("chegou aqui",params)
    //função que retorna valores no DB "where" tem um valor específico
    let cinema = null
    if (params.query == 'all') {
      cinema = await Cinema.query().where('isOnline', true).orderBy('name','asc').fetch()
      //cinema = await Cinema.query().orderBy('name','asc').fetch()
    } else {
      cinema = await Cinema.query().where('category', params.query).andWhere('isOnline', true).orderBy('name','asc').fetch()
    }
    return cinema
  }

}

module.exports = CinemaController
