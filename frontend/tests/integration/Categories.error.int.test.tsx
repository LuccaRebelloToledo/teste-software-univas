import { render, screen, waitFor } from '@testing-library/react'
import Categories from '../../src/components/Categories'
import { server, apiGet } from '../setup'
import { HttpResponse } from 'msw'
import { describe, it, expect } from 'vitest'

describe('Categories integration - falhas de API', () => {
    it('mostra mensagem de erro quando API falha', async () => {
        server.use(
            apiGet('/categories', () => HttpResponse.error())
        )
        render(<Categories />)
        await waitFor(() => {
            expect(
                screen.getByText(/Erro ao carregar categorias/i)
            ).toBeInTheDocument();
        })
    })
})