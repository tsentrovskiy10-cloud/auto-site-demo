import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('APEX site', () => {
  beforeEach(() => localStorage.clear())
  it('renders the main content and services', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Автомобиль')
    expect(screen.getByText('Детейлинг-мойка')).toBeInTheDocument()
    expect(screen.getByText('Porsche 911 Carrera')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: companyPhone })[0]).toHaveAttribute('href', 'tel:+79991234567')
  })
  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup(); render(<App />)
    await user.click(screen.getByLabelText('Открыть меню'))
    expect(screen.getByLabelText('Мобильная навигация').parentElement).toHaveClass('is-open')
    await user.click(screen.getByLabelText('Закрыть меню'))
    expect(screen.getByLabelText('Мобильная навигация').parentElement).not.toHaveClass('is-open')
  })
  it('validates and submits lead form', async () => {
    const user = userEvent.setup(); render(<App />)
    const submit = screen.getByRole('button', { name: /Получить расчёт/ })
    await user.click(submit)
    expect(screen.getByText('Укажите имя')).toBeInTheDocument()
    expect(screen.getByText('Введите корректный номер телефона')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/Ваше имя/), 'Антон')
    await user.type(screen.getByLabelText(/Телефон/), '123')
    await user.click(submit)
    expect(screen.getByText('Введите корректный номер телефона')).toBeInTheDocument()
    await user.clear(screen.getByLabelText(/Телефон/)); await user.type(screen.getByLabelText(/Телефон/), '+7 999 555-44-33')
    await user.click(submit)
    expect(await screen.findByText('Заявка принята')).toBeInTheDocument()
    expect(localStorage.getItem('apex-leads')).toContain('Антон')
  })
  it('opens legal modal and closes it with Escape', async () => {
    const user=userEvent.setup();render(<App />)
    await user.click(screen.getByRole('button',{name:'Политика конфиденциальности'}))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(window,{key:'Escape'})
    await waitFor(()=>expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
  it('shows an interactive Yandex map and expands it', async () => {
    const user=userEvent.setup();render(<App />)
    expect(screen.getByTitle('Интерактивная карта проезда к APEX DETAILING')).toHaveAttribute('src',expect.stringContaining('yandex.ru/map-widget'))
    await user.click(screen.getByRole('button',{name:'Развернуть карту'}))
    expect(screen.getByRole('dialog',{name:'Карта проезда'})).toBeInTheDocument()
    await user.click(screen.getByRole('button',{name:'Закрыть карту'}))
    expect(screen.queryByRole('dialog',{name:'Карта проезда'})).not.toBeInTheDocument()
  })
})
const companyPhone = '+7 (999) 123-45-67'
