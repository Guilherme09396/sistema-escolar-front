import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'

import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Home() {

  const [alunos, setAlunos] = useState([])

  const [anoMatricula, setAnoMatricula] =
    useState('todos')

  const [anosDisponiveis, setAnosDisponiveis] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  // MODAL DELETE
  const [showDeleteModal, setShowDeleteModal] =
    useState(false)

  const [alunoParaExcluir, setAlunoParaExcluir] =
    useState(null)

  // NOTIFICAÇÃO
  const [notification, setNotification] = useState(null)

  function showNotification(type, message) {

    setNotification({
      type,
      message
    })

    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }


  // FORMATA DATA SEM TIMEZONE
  const formatar = (dataString) => {

    if (!dataString) {
      return '-'
    }

    try {

      let data

      if (dataString.includes('T')) {

        data = new Date(dataString)

      } else {

        data = new Date(
          dataString + 'T12:00:00'
        )
      }

      if (!isValid(data)) {
        return '-'
      }

      return format(
        data,
        'dd/MM/yyyy',
        { locale: ptBR }
      )

    } catch (error) {

      console.log(error)

      return '-'
    }
  }

  useEffect(() => {

    async function fetchAlunos() {

      try {

        const urlApi =
          anoMatricula == "todos"
            ? '/alunos'
            : `/alunos/ano/?anoMatricula=${anoMatricula}`

        setLoading(true)

        const response = await api.get(
          `${urlApi}`
        )

        setAnosDisponiveis(
          response.data.anosDisponiveis || []
        )

        setAlunos(
          response.data.alunos || []
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }
    }

    fetchAlunos()

  }, [anoMatricula])

  function handleChange(event) {

    setAnoMatricula(
      event.target.value
    )
  }

  function openDeleteModal(aluno) {

    setAlunoParaExcluir(aluno)

    setShowDeleteModal(true)
  }

  function closeDeleteModal() {

    setAlunoParaExcluir(null)

    setShowDeleteModal(false)
  }

  async function confirmDelete() {

    try {

      await api.delete(
        `/alunos/deletar/${alunoParaExcluir.id}`
      )

      showNotification(
        'success',
        'Aluno deletado com sucesso!'
      )

      setAlunos(prev =>
        prev.filter(
          aluno =>
            aluno.id !== alunoParaExcluir.id
        )
      )

      closeDeleteModal()
      
    } catch (error) {
      
      console.log(error)
      
      showNotification(
        'error',
        'Erro ao deletar Aluno.'
      )
      
      closeDeleteModal()
    }
  }

  return (

    <div className='container'>

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
    

      {/* MODAL DELETE */}

      {showDeleteModal && (

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >

          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '420px',
              boxShadow:
                '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >

            <h2
              style={{
                marginBottom: '12px'
              }}
            >
              🗑 Excluir aluno
            </h2>

            <p
              style={{
                color: '#6b7280',
                lineHeight: '1.5'
              }}
            >

              Deseja realmente excluir o aluno:

              <br />
              <br />

              <strong>
                {alunoParaExcluir?.nome}
              </strong>

            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '30px'
              }}
            >

              <button
                onClick={closeDeleteModal}
                style={{
                  border: 'none',
                  background: '#e5e7eb',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmDelete}
                style={{
                  border: 'none',
                  background: '#dc2626',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Confirmar exclusão
              </button>

            </div>

          </div>

        </div>

      )}

      <div className='header'>

        <div>

          <h1 className='title'>
            Sistema Escolar
          </h1>

          <p>
            Gerenciamento de matrículas
          </p>

        </div>

        <Link
          className='button'
          to='/alunos/criar'
        >
          + Novo aluno
        </Link>

      </div>

      <div className='card'>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >

          <select
            value={anoMatricula}
            onChange={handleChange}
            id="anoMatricula"
            className='select'
          >

            <option
              key={'todos'}
              value={'todos'}
            >

              Todos os anos

            </option>

            {anosDisponiveis.map(ano => (

              <option
                key={ano}
                value={ano}
              >

                {ano}

              </option>

            ))}

          </select>

          <div
            style={{
              color: '#6b7280',
              fontSize: '14px'
            }}
          >

            {alunos.length} alunos encontrados

          </div>

        </div>

        {loading ? (

          <div
            style={{
              padding: '30px',
              textAlign: 'center'
            }}
          >

            Carregando alunos...

          </div>

        ) : alunos.length === 0 ? (

          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              color: '#6b7280'
            }}
          >

            Nenhum aluno encontrado.

          </div>

        ) : (

          <table className='table'>

            <thead>

              <tr>

                <th>Nome</th>

                <th>Matrícula</th>

                <th>Data de Nascimento</th>

                <th>Responsável</th>

                <th>Ações</th>

              </tr>

            </thead>

            <tbody>

              {alunos.map(aluno => (

                <tr key={aluno.id}>

                  <td>
                    {aluno.nome}
                  </td>

                  <td>
                    {aluno.matricula}
                  </td>

                  <td>
                    {formatar(
                      aluno.dataNascimento
                    )}
                  </td>

                  <td>

                    <Link
                      to={`/responsaveis/${aluno.responsavel.id}`}
                      style={{
                        position: 'relative',
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: '600'
                      }}
                      className='responsavel-link'
                    >

                      {aluno.responsavel.nome}

                      <span className='tooltip'>
                        👀 Ver alunos do responsável
                      </span>

                    </Link>

                    <br />

                    <small
                      style={{
                        color: '#6b7280'
                      }}
                    >
                      {aluno.responsavel.email}
                    </small>

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        openDeleteModal(aluno)
                      }
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      🗑 Excluir
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}