'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactsSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('phone', 254)
      table.string('email', 254).notNullable()
      table.text('message').notNullable()
      table.integer('answered')
      table.timestamps()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactsSchema
