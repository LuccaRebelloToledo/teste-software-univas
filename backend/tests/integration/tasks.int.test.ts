import { describe, it, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import app, { prisma as appPrisma } from '../../src/index'
import { prisma, resetDb, seedMinimal } from './testDb'

describe('Tasks API', () => {
  afterAll(async () => {
    await prisma.$disconnect()
    await appPrisma.$disconnect()
  })

  beforeEach(async () => {
    await resetDb()
  })

  it('POST /api/tasks cria tarefa válida', async () => {
    const { user, category } = await seedMinimal()

    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Comprar mantimentos',
        description: 'Leite, ovos e pão',
        status: 'PENDING',
        priority: 'HIGH',
        userId: user.id,
        categoryId: category.id
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({
      title: 'Comprar mantimentos',
      description: 'Leite, ovos e pão',
      status: 'PENDING',
      priority: 'HIGH',
      userId: user.id,
      categoryId: category.id
    })
    expect(res.body.data.id).toBeDefined()
    expect(res.body.data.createdAt).toBeDefined()
    expect(res.body.data.updatedAt).toBeDefined()
  })

  it('GET /api/tasks lista todas as tarefas', async () => {
    const { user, category } = await seedMinimal()

    await prisma.task.create({
      data: {
        title: 'Tarefa 1',
        userId: user.id,
        categoryId: category.id
      }
    })

    await prisma.task.create({
      data: {
        title: 'Tarefa 2',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app).get('/api/tasks')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.data[0]).toMatchObject({
      title: 'Tarefa 2',
      status: 'IN_PROGRESS',
      priority: 'URGENT'
    })
    expect(res.body.data[1]).toMatchObject({
      title: 'Tarefa 1',
      status: 'PENDING',
      priority: 'MEDIUM'
    })
  })

  it('GET /api/tasks/:id busca tarefa existente por ID', async () => {
    const { user, category } = await seedMinimal()

    const task = await prisma.task.create({
      data: {
        title: 'Tarefa específica',
        description: 'Descrição detalhada',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app).get(`/api/tasks/${task.id}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({
      id: task.id,
      title: 'Tarefa específica',
      description: 'Descrição detalhada',
      userId: user.id,
      categoryId: category.id
    })
  })

  it('PUT /api/tasks/:id atualiza tarefa existente', async () => {
    const { user, category } = await seedMinimal()

    const task = await prisma.task.create({
      data: {
        title: 'Tarefa original',
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        title: 'Tarefa atualizada',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        description: 'Nova descrição'
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({
      id: task.id,
      title: 'Tarefa atualizada',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      description: 'Nova descrição'
    })
  })

  it('DELETE /api/tasks/:id deleta tarefa com sucesso', async () => {
    const { user, category } = await seedMinimal()

    const task = await prisma.task.create({
      data: {
        title: 'Tarefa a ser deletada',
        userId: user.id,
        categoryId: category.id
      }
    })

    const res = await request(app).delete(`/api/tasks/${task.id}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const deletedTask = await prisma.task.findUnique({
      where: { id: task.id }
    })
    expect(deletedTask).toBeNull()
  })
})
