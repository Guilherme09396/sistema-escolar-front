import React, { useState, useEffect } from 'react'
import {
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom'
import { api } from '../../services/api'

export default function CreateAluno() {
  const navigate = useNavigate()
  const location = useLocation()

  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')

  const [search, setSearch] = useState('')
  const [responsaveis, setResponsaveis] = useState([])

  const [responsavelSelecionado, setResponsavelSelecionado] = useState(null)

  const [loading, setLoading] = useState(false)

  const [responsaveisDisponiveis, setResponsaveisDisponiveis] = useState([])

  // NOTIFICAÇÃO
  const [notification, setNotification] = useState(null)

  // ERROS DOS CAMPOS
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {

    if (location.state?.formData) {

      const data = location.state.formData

      setNome(data.nome || '')
      setDataNascimento(
        data.dataNascimento || ''
      )

    }

    if (location.state?.novoResponsavel) {

      const responsavel =
        location.state.novoResponsavel

      setResponsavelSelecionado(
        responsavel
      )

      setSearch(
        responsavel.nome
      )

      setResponsaveisDisponiveis(prev => [
        ...prev,
        responsavel
      ])
    }

  }, [location.state])

  useEffect(() => {

    async function fetchResponsaveis() {

      try {

        const response = await api.get('/responsaveis')

        setResponsaveisDisponiveis(
          response.data.responsaveis
        )

      } catch (error) {

        console.log(error)

      }

    }

    fetchResponsaveis()

  }, [])

  useEffect(() => {

    const delay = setTimeout(() => {

      if (search.length === 0) {
        setResponsaveis([])
        return
      }

      if (
        search.length >= 3 &&
        !responsavelSelecionado
      ) {

        const filtered =
          responsaveisDisponiveis.filter(item => {

            return (
              item.nome
                .toLowerCase()
                .includes(search.toLowerCase())

              ||

              item.email
                .toLowerCase()
                .includes(search.toLowerCase())
            )

          })

        setResponsaveis(filtered)
      }

    }, 300)

    return () => clearTimeout(delay)

  }, [search, responsaveisDisponiveis, responsavelSelecionado])

  function handleSelectResponsavel(responsavel) {

    setResponsavelSelecionado(responsavel)

    setSearch(responsavel.nome)

    setResponsaveis([])
  }

  function showNotification(type, message) {

    setNotification({
      type,
      message
    })

    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      setLoading(true)

      // LIMPAR ERROS
      setFieldErrors({})

      const payload = { 
        nome,
        dataNascimento: new Date(`${dataNascimento}T12:00:00`).toISOString(),
        responsavelId: responsavelSelecionado?.id
      }

      await api.post('/alunos/criar', payload)

      showNotification(
        'success',
        'Aluno cadastrado com sucesso!'
      )

      // limpar formulário
      setNome('')
      setDataNascimento('')
      setSearch('')
      setResponsavelSelecionado(null)

    } catch (error) {

      console.log(error)

      // ERROS DE VALIDAÇÃO
      if (error.response?.data?.errors) {

        setFieldErrors(
          error.response.data.errors
        )

        showNotification(
          'error',
          'Existem campos inválidos.'
        )

      } else {

        showNotification(
          'error',
          error?.response?.data?.message
          ||
          'Erro ao cadastrar aluno'
        )

      }

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className='container'>

      <Link
                to='/'
                style={{
                  textDecoration: 'none',
                  color: '#2563eb',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                🏠 Página inicial
              </Link>

      {/* NOTIFICAÇÃO */}

      {notification && (

        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 9999,
            minWidth: '320px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',

            background:
              notification.type === 'success'
                ? '#16a34a'
                : '#dc2626'
          }}
        >

          {notification.message}

        </div>

      )}

      <div className='header'>

        <div>

          <h1 className='title'>
            Cadastrar aluno
          </h1>

          <p>
            Preencha os dados do aluno
          </p>

        </div>

      </div>

      <div className='card'>

        <form onSubmit={handleSubmit}>

          {/* NOME */}

          <div className='form-group'>

            <label className='label'>
              Nome
            </label>

            <input
              className='input'
              placeholder='Digite o nome do aluno'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            {fieldErrors.nome && (

              <div
                style={{
                  color: '#dc2626',
                  marginTop: '-10px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}
              >

                {fieldErrors.nome.map(
                  (error, index) => (
                    <div key={index}>
                      {error}
                    </div>
                  )
                )}

              </div>

            )}

          </div>

          {/* DATA NASCIMENTO */}

          <div className='form-group'>

            <label className='label'>
              Data nascimento
            </label>

            <input
              className='input'
              type='date'
              value={dataNascimento}
              onChange={(e) =>
                setDataNascimento(e.target.value)
              }
            />

            {fieldErrors.dataNascimento && (

              <div
                style={{
                  color: '#dc2626',
                  marginTop: '-10px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}
              >

                {fieldErrors.dataNascimento.map(
                  (error, index) => (
                    <div key={index}>
                      {error}
                    </div>
                  )
                )}

              </div>

            )}

          </div>

          {/* RESPONSÁVEL */}

          <div className='form-group'>

            <label className='label'>
              Responsável
            </label>

            <input
              className='input'
              placeholder='Buscar responsável'
              value={search}
              onChange={(e) => {

              const value = e.target.value

              setSearch(value)

              // limpa apenas se apagar/alterar manualmente
              if (
                responsavelSelecionado &&
                value !== responsavelSelecionado.nome
              ) {

                setResponsavelSelecionado(null)

              }

            }}
            />

            {responsaveis.length > 0 && (

              <div className='search-results'>

                {responsaveis.map(item => (

                  <div
                    className='search-item'
                    key={item.id}

                    onMouseDown={() =>
                      handleSelectResponsavel(item)
                    }
                  >

                    <strong>
                      {item.nome}
                    </strong>

                    <br />

                    <small>
                      {item.email}
                    </small>

                  </div>

                ))}

              </div>

            )}

            {responsavelSelecionado && (

              <div
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: '#eff6ff',
                  borderRadius: '10px'
                }}
              >

                ✅ Responsável selecionado:
                <br />

                <strong>
                  {responsavelSelecionado.nome}
                </strong>

              </div>

            )}

            {fieldErrors.responsavelId && (

              <div
                style={{
                  color: '#dc2626',
                  marginTop: '10px',
                  fontSize: '14px'
                }}
              >

                {fieldErrors.responsavelId.map(
                  (error, index) => (
                    <div key={index}>
                      {error}
                    </div>
                  )
                )}

              </div>

            )}

            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              >

              <small
                style={{
                  color: '#6b7280'
                }}
              >

                Não encontrou o responsável?

              </small>

              <Link
                to='/responsaveis/criar'
                state={{
                  formData: {
                    nome,
                    dataNascimento
                  }
                }}
                style={{
                  color: '#2563eb',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >

                Cadastrar responsável

              </Link>

              </div>

          </div>

          <button
            className='button'
            disabled={loading}
          >

            {loading
              ? 'Salvando...'
              : 'Salvar aluno'
            }

          </button>

        </form>

      </div>

    </div>
  )
}