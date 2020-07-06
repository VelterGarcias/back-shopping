'use strict'
const User = use('App/Models/User.js')

class AuthController {

    async store({request,response, auth}) {
        const { email, password } = request.all()
        const emails = request.only('email')
        const user = await User.findByOrFail(emails)
        const token = await auth.attempt(email, password)

        return {user, token}
    }

    async profile({ auth, response }) {
        return await auth.getUser()
    }

}

module.exports = AuthController
