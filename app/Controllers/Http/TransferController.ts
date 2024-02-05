import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Client from 'App/Models/Client'

export default class TransferController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const dataScheme = schema.create({
      from: schema.number(),
      to: schema.number(),
      amount: schema.number([rules.range(0, 1000)]),
    })
    const data = await request.validate({ schema: dataScheme })

    const trx = await Database.transaction({ isolationLevel: 'repeatable read' })
    const clientFrom = await Client.query({ client: trx }).where('id', data.from).firstOrFail()
    if (data.amount > clientFrom.amount) {
      await trx.rollback()
      return response.forbidden({ error: 'Insufficient funds' })
    }
    const clientTo = await Client.query({ client: trx }).where('id', data.to).firstOrFail()

    clientTo.amount += data.amount
    clientFrom.amount -= data.amount

    // SIMULE CONCURRENCY
    const trx2 = await Database.transaction()
    try {
      const client = await Client.query({ client: trx2 }).where('id', data.from).firstOrFail()
      client.amount = 0
      await client.save()
      await trx2.commit()
    } catch (error) {
      console.log(error)
      await trx2.rollback()
      return response.badGateway({ error })
    }

    try {
      clientFrom.useTransaction(trx)
      await clientFrom.save()
      await clientTo.save()
      await trx.commit()
      return { clientFrom }
    } catch (error) {
      await trx.rollback()
      return response.badGateway({ error })
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
