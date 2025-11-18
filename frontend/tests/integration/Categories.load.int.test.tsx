import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories'
import { server, apiGet, json } from '../setup'
import { HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'

describe('Categories integration - carga de lista', () => {
    it('renderiza categorias retornadas pela API', async () => {
        server.use(
            apiGet('/categories', (_req) => 
                json({
                    data: [
                        { id: '1', name: 'Financeiro', description: 'Contas', createdAt: new Date().toISOString(), tasks: [] },
                        { id: '2', name: 'IT', description: 'Desenvolvimento', createdAt: new Date().toISOString(), tasks: [] },
                    ]
                })
            )
        )
        render(<Categories />)
        await waitFor(() => {
            expect(screen.getByText('Financeiro')).toBeInTheDocument()
            expect(screen.getByText('Contas')).toBeInTheDocument()
            expect(screen.getByText('IT')).toBeInTheDocument()
            expect(screen.getByText('Desenvolvimento')).toBeInTheDocument()
        })
    })
})