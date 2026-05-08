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

  // FORMATA DATA SEM TIMEZONE
  const formatar = (dataString) => {

    // sem data
    if (!dataString) {
      return '-'
    }

    try {

      let data

      // caso venha ISO
      if (dataString.includes('T')) {

        data = new Date(dataString)

      } else {

        // evita problema timezone
        data = new Date(
          dataString + 'T12:00:00'
        )
      }

      // valida data
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

        const urlApi = anoMatricula == "todos" ? '/alunos' : `/alunos/ano/?anoMatricula=${anoMatricula}`

        setLoading(true)
        const response = await api.get(
          `${urlApi}`
        )
        console.log(response)

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

  return (

    <div className='container'>

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

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}