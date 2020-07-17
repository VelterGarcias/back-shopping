'use strict'

const Shop = use('App/Models/Shop')
// const Helpers = use('Helpers')
// const fs = use('fs')
// const readFile = Helpers.promisify(fs.readFile)
// const deleteFile = Helpers.promisify(fs.unlink)
// const uploadDir = 'uploads'
const Drive = use('Drive')

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
        const shop = await Shop.findOrFail(params.id)
        const folder = 'uploads';
        
        request.multipart.file('file', {
            size: '1mb',
            extnames: ['jpg', 'png', 'webP', 'jpeg'] 
        }, async file => {
        await Drive.put(`${folder}/shops/${params.id}/logo`, file.stream, {
            ACL: 'public-read',
            ContentType: `${file.type}/${file.subtype}`,
        });
        });

        await request.multipart.process();

        shop.logo = `logo`

        await shop.save()

        return shop
  }

  // async changeLogo({params, request, response}) {
  //   const photo = request.file('file', {
  //       size: '2mb',
  //       extnames: ['jpg', 'png', 'webP', 'jpeg']
  //   })
    
  //   if (!photo) {
  //       response.status(400).json({error: 'File required'})
  //       return
  //   }

    
  //   const shop = await Shop.findOrFail(params.id)
    
  //   const name = `shops/${shop.id}/${photo.clientName.split('.')[0]}.${photo.extname}`

  //   await photo.move(Helpers.resourcesPath(uploadDir), {
  //       name,
  //       overwrite: true
  //   })

  //   if(!photo.moved()) {
  //       response.status(400).json({'error': photo.error()})
  //   } else {

  //       //deleta a foto anterior se existir uma
  //       try {       
  //         await deleteFile(Helpers.resourcesPath(shop.logo))
  //       } catch (err) {
  //         console.log("Não há fotos para excluir")
  //       }

  //       shop.logo = `${uploadDir}/${name}`

  //       await shop.save()
  
  //       return shop
  //   }

    
  // }

  async logo({params, response}) {

      const shop = await Shop.findOrFail(params.id)
      const folder = `uploads/shops/${params.id}`;
      response.implicitEnd = false
      response.header('Content-type', 'image/*')

      const stream = await Drive.getStream(`${folder}/${shop.logo}`)

      stream.pipe(response.response)
  }

  async changePhoto({params, request, response}) {
    

        const shop = await Shop.findOrFail(params.id)
        const folder = 'uploads';

        request.multipart.file('file', {
            size: '1mb',
            extnames: ['jpg', 'png', 'webP', 'jpeg'] 
        }, async file => {
        await Drive.put(`${folder}/shops/${params.id}/photo${params.photoId}`, file.stream, {
            ACL: 'public-read',
            ContentType: `${file.type}/${file.subtype}`,
        });
        });

        await request.multipart.process();

        switch (params.photoId) {
            case "1":
              shop.photo1 = `photo1`
              break;
  
            case "2":
              shop.photo2 = `photo2`
              break;
  
            case "3":
              shop.photo3 = `photo3`
              break;
  
            case "4":
              shop.photo4 = `photo4`
              break;
  
            case "5":
              shop.photo5 = `photo5`
              break;       
            case "6":
              shop.photo6 = `photo6`
              break;  
        }

        await shop.save()

        return shop
  }
  // async changePhoto({params, request, response}) {
  //   const photo = request.file('file', {
  //       size: '2mb',
  //       extnames: ['jpg', 'png', 'webP', 'jpeg']
  //   })
    
  //   if (!photo) {
  //       response.status(400).json({error: 'File required'})
  //       return
  //   }

    
  //   const shop = await Shop.findOrFail(params.id)
  //   const oldExtName = shop.photo1 ? shop.photo1.split('.')[1] : null
  //   const name = `shops/${shop.id}/photo${params.photoId}.${photo.extname}`

  //   await photo.move(Helpers.resourcesPath(uploadDir), {
  //       name,
  //       overwrite: true
  //   })

  //   if(!photo.moved()) {
  //       response.status(400).json({'error': photo.error()})
  //   } else {       
  //       //deleta a foto anterior se existir uma
  //       switch (params.photoId) {
  //         case "1":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo1))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo1 = `${uploadDir}/${name}`
  //           break;

  //         case "2":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo2))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo2 = `${uploadDir}/${name}`
  //           break;

  //         case "3":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo3))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo3 = `${uploadDir}/${name}`
  //           break;

  //         case "4":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo4))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo4 = `${uploadDir}/${name}`
  //           break;

  //         case "5":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo5))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo5 = `${uploadDir}/${name}`
  //           break;       
  //         case "6":
  //           if (oldExtName != photo.extname) {
  //             try {       
  //                 await deleteFile(Helpers.resourcesPath(shop.photo6))
  //             } catch (err) {
  //                 console.log("Não há fotos para excluir", err)
  //             }
  //           }
  //           shop.photo6 = `${uploadDir}/${name}`
  //           break;  
  //       }
        
  //       await shop.save()
  
  //       return shop
  //   }
  // } 

  async photo({params, response}) {

    const shop = await Shop.findOrFail(params.id)
    const folder = `uploads/shops/${params.id}`;

    const exists = await Drive.exists(`${folder}/photo${params.photoId}`)
    if (exists) {
      response.implicitEnd = false
      response.header('Content-type', 'image/*')

      const stream = await Drive.getStream(`${folder}/photo${params.photoId}`)

      stream.pipe(response.response)
    } else {
      return response.status(400).json({'error': "O parâmetro informado não existe"})
    }
}

async deletePhoto({params, response}) {

  const shop = await Shop.findOrFail(params.id)
  const folder = `uploads/shops/${params.id}`;
  let data = null
  
  switch (params.photoId) {
    case "1":
      data = { "photo1": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break;
    case "2":
      data = { "photo2": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break;
    case "3":
      data = { "photo3": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break;
    case "4":
      data = { "photo4": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break;
    case "5":
      data = { "photo5": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break;   
    case "6":
      data = { "photo6": null }
      try {       
          await Drive.delete(`${folder}/photo${params.photoId}`)
      } catch (err) {
          console.log("Não há fotos para excluir", err)
      }
      break; 
    default:
      response.status(400).json({'error': "O parâmetro informado não existe"})
      break;
  }

  shop.merge(data)

  //executando no MySQL
  await shop.save()

  return shop
}
// async deletePhoto({params, response}) {

//   const shop = await Shop.findOrFail(params.id)
//   let data = null
  
//   switch (params.photoId) {
//     case "1":
//       data = { "photo1": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo1))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break;
//     case "2":
//       data = { "photo2": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo2))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break;
//     case "3":
//       data = { "photo3": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo3))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break;
//     case "4":
//       data = { "photo4": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo4))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break;
//     case "5":
//       data = { "photo5": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo5))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break;   
//     case "6":
//       data = { "photo6": null }
//       try {       
//           await deleteFile(Helpers.resourcesPath(shop.photo6))
//       } catch (err) {
//           console.log("Não há fotos para excluir", err)
//       }
//       break; 
//     default:
//       response.status(400).json({'error': "O parâmetro informado não existe"})
//       break;
//   }

//   shop.merge(data)

//   //executando no MySQL
//   await shop.save()

//   return shop
// }

async showWhere({ params }) {
  //console.log("chegou aqui",params)
  //função que retorna valores no DB "where" tem um valor específico
  let shop = null
  if (params.query == 'all') {
    //shop = await Shop.query().where('isOnline', true).orderBy('name','asc').fetch()
    shop = await Shop.query().orderBy('name','asc').fetch()
  } else {
    shop = await Shop.query().where('category', params.query).andWhere('isOnline', true).orderBy('name','asc').fetch()
  }
  return shop
}

}

module.exports = ShopController