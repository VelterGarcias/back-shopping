'use strict'
const User = use('App/Models/User')
// const Helpers = use('Helpers')
// const fs = use('fs')
// const readFile = Helpers.promisify(fs.readFile)
// const deleteFile = Helpers.promisify(fs.unlink)
// const uploadDir = 'uploads'
const Drive = use('Drive')

class UserController {

    async store ({ request , auth}) {
        const data = request.only(['name', 'email', 'photo', 'birth_at', 'level', 'password'])

        const user = await User.create(data)
        const token = await auth.attempt(user.email, data.password)
        

        return {user, token}
    }

    async newUser ({ request , auth}) {
        const data = request.only(['name', 'email', 'photo', 'birth_at', 'level', 'password'])

        const user = await User.create(data)
        const token = await auth.attempt(user.email, data.password)
        

        return {user, token}
    }

    async index() {
        return await User.all()
    }

    async show({ params }) {
        const user = await User.findOrFail(params.id)

        return user
    }

    async destroy({params, auth, response}) {
        const user = await User.findOrFail(params.id)

        // Esse código é pra verificar se o usuário tem permissão pra excluir
        // if(user.id !== auth.user.id) {
        //     return response.status(401).send({error: 'Not authorized'})
        // }

        await user.delete()
    }

    async update({params, request}) {
        const user = await User.findOrFail(params.id)

        const data = request.only(['name', 'email', 'photo', 'birth_at', 'level', 'password'])

        user.merge(data)

        //executando no MySQL
        await user.save()

        return user

    }

    // async changePhoto({params, request, response}) {
    //     const photo = request.file('file', {
    //         maxSize: '2mb',
    //         allowedExtensions: ['jpg', 'png', 'webP', 'jpeg']
    //     })
        
    //     if (!photo) {
    //         response.status(400).json({error: 'File required'})
    //         return
    //     }

        
    //     const user = await User.findOrFail(params.id)
    //     //deleta a foto anterior se existir uma
    //     try {       
    //         await deleteFile(Helpers.resourcesPath(user.photo))
    //     } catch (err) {
    //         console.log("Não há fotos para excluir", err)
    //     }
    //     const name = `${user.id}/${photo.clientName.split('.')[0]}.${photo.extname}`

    //     await photo.move(Helpers.resourcesPath(uploadDir), {
    //         name,
    //         overwrite: true
    //     })

    //     if(!photo.moved()) {
    //         response.status(400).json({'error': photo.error()})
    //     }

    //     user.photo = `${uploadDir}/${name}`

    //     await user.save()

    //     return user
    // }

    async changePhoto({params, request, response}) {
        
        const user = await User.findOrFail(params.id)
        const folder = 'uploads';
        
        request.multipart.file('file', {
            size: '1mb',
            extnames: ['jpg', 'png', 'webP', 'jpeg'] 
        }, async file => {
        await Drive.put(`${folder}/users/${params.id}/avatar-${params.id}`, file.stream, {
            ACL: 'public-read',
            ContentType: `${file.type}/${file.subtype}`,
        });
        });

        await request.multipart.process();

        user.photo = `avatar-${params.id}`

        await user.save()

        return user
    }

    // async photo({params, response}) {

    //     const user = await User.findOrFail(params.id)
    //     const content = await readFile(Helpers.resourcesPath(user.photo))

    //     response.header('Content-type', 'image/*').send(content)
    // }

    async photo({params, response}) {

        const user = await User.findOrFail(params.id)
        const folder = `uploads/users/${params.id}`;

        const exists = await Drive.exists(`${folder}/${user.photo}`)
        if (exists) {
            response.implicitEnd = false
            response.header('Content-type', 'image/*')

            const stream = await Drive.getStream(`${folder}/${user.photo}`)

            stream.pipe(response.response)
        } else {
            return response.status(400).json({'error': "O parâmetro informado não existe"})
        }
    }


}

module.exports = UserController
