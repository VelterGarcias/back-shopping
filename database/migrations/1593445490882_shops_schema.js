'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShopsSchema extends Schema {
  up () {
    this.create('shops', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.text('description')
      table.text('long_description')
      table.string('category',254).notNullable()
      table.string('sub_category',254)
      table.string('adress',254).notNullable()
      table.string('phone',254)
      table.string('smartphone',254)
      table.string('whatsapp',254)
      table.string('website',254)
      table.string('facebook',254)
      table.string('instagram',254)
      table.string('admin_mail', 254).unique()
      table.string('logo', 254)
      table.string('photo1', 254)
      table.string('photo2', 254)
      table.string('photo3', 254)
      table.string('photo4', 254)
      table.string('photo5', 254)
      table.string('photo6', 254)
      table.boolean('isOnline')
      table.timestamps()
    })
  }

  down () {
    this.drop('shops')
  }
}

module.exports = ShopsSchema
