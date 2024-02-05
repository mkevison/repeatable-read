import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Client from 'App/Models/Client'

export default class extends BaseSeeder {
  public async run() {
    await Client.createMany([
      { name: 'Client 1', amount: 100 },
      { name: 'Client 2', amount: 0 },
    ])
  }
}
