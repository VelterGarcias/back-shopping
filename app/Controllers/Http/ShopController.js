'use strict'

const Shop = use('App/Models/Shop')
const Helpers = use('Helpers')
const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)
const deleteFile = Helpers.promisify(fs.unlink)
const uploadDir = 'uploads'

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

  async changeLogo({params, request, response}) {
    const photo = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'webP', 'jpeg']
    })
    
    if (!photo) {
        response.status(400).json({error: 'File required'})
        return
    }

    
    const shop = await Shop.findOrFail(params.id)
    
    const name = `${shop.id}/${photo.clientName.split('.')[0]}.${photo.extname}`

    await photo.move(Helpers.resourcesPath(uploadDir), {
        name,
        overwrite: true
    })

    if(!photo.moved()) {
        response.status(400).json({'error': photo.error()})
    } else {

        //deleta a foto anterior se existir uma
        try {       
          await deleteFile(Helpers.resourcesPath(shop.logo))
        } catch (err) {
          console.log("Não há fotos para excluir")
        }

        shop.logo = `${uploadDir}/${name}`

        await shop.save()
  
        return shop
    }

    
  }

  async logo({params, response}) {

      const shop = await Shop.findOrFail(params.id)
      const content = await readFile(Helpers.resourcesPath(shop.logo))

      response.header('Content-type', 'image/*').send(content)
  }

  async changePhoto({params, request, response}) {
    const photo = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'webP', 'jpeg']
    })
    
    if (!photo) {
        response.status(400).json({error: 'File required'})
        return
    }

    
    const shop = await Shop.findOrFail(params.id)
    const oldExtName = shop.photo1 ? shop.photo1.split('.')[1] : null
    const name = `shops/${shop.id}/photo${params.photoId}.${photo.extname}`

    await photo.move(Helpers.resourcesPath(uploadDir), {
        name,
        overwrite: true
    })

    if(!photo.moved()) {
        response.status(400).json({'error': photo.error()})
    } else {       
        //deleta a foto anterior se existir uma
        switch (params.photoId) {
          case "1":
            if (oldExtName != photo.extname) {
              try {       
                  await deleteFile(Helpers.resourcesPath(shop.photo1))
              } catch (err) {
                  console.log("Não há fotos para excluir", err)
              }
            }
            shop.photo1 = `${uploadDir}/${name}`
            break;

          case "2":
            if (oldExtName != photo.extname) {
              try {       
                  await deleteFile(Helpers.resourcesPath(shop.photo2))
              } catch (err) {
                  console.log("Não há fotos para excluir", err)
              }
            }
            shop.photo2 = `${uploadDir}/${name}`
            break;

          case "3":
            if (oldExtName != photo.extname) {
              try {       
                  await deleteFile(Helpers.resourcesPath(shop.photo3))
              } catch (err) {
                  console.log("Não há fotos para excluir", err)
              }
            }
            shop.photo3 = `${uploadDir}/${name}`
            break;

          case "4":
            if (oldExtName != photo.extname) {
              try {       
                  await deleteFile(Helpers.resourcesPath(shop.photo4))
              } catch (err) {
                  console.log("Não há fotos para excluir", err)
              }
            }
            shop.photo4 = `${uploadDir}/${name}`
            break;

          case "5":
            if (oldExtName != photo.extname) {
              try {       
                  await deleteFile(Helpers.resourcesPath(shop.photo5))
              } catch (err) {
                  console.log("Não há fotos para excluir", err)
              }
            }
            shop.photo5 = `${uploadDir}/${name}`
            break;       
        }
        
        await shop.save()
  
        return shop
    }

    
  } 

  async photo({params, response}) {

    const shop = await Shop.findOrFail(params.id)
    let content = null
    switch (params.photoId) {
      case "1":
        content = await readFile(Helpers.resourcesPath(shop.photo1))
        break;
      case "2":
        content = await readFile(Helpers.resourcesPath(shop.photo2))
        break;
      case "3":
        content = await readFile(Helpers.resourcesPath(shop.photo3))
        break;
      case "4":
        content = await readFile(Helpers.resourcesPath(shop.photo4))
        break;
      case "5":
        content = await readFile(Helpers.resourcesPath(shop.photo5))
        break;   
      default:
        response.status(400).json({'error': 'parâmetro inválido'})
        break;
    }

    response.header('Content-type', 'image/*').send(content)
}


}

module.exports = ShopController