'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CinemasSchema extends Schema {
  up () {
    this.create('cinemas', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('photo', 254)
      table.string('category',254).notNullable()
      table.string('sub_category',254)
      table.text('description')
      table.integer('age')
      table.integer('language')
      table.boolean('isOnline')
      table.timestamps()
    })
  }

  down () {
    this.drop('cinemas')
  }
}

module.exports = CinemasSchema
