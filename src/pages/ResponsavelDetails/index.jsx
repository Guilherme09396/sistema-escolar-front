import React, { useEffect, useState } from 'react'

import { useParams, Link } from 'react-router-dom'

import { api } from '../../services/api'

import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ResponsavelDetails() {

  const { id } = useParams()

  const [responsavel, setResponsavel] = useState(null)

  const [loading, setLoading] = useState(true)

  function formatar(dataString) {

    if (!dataString) {
      return '-'
    }

    try {

      let data

      if (dataString.includes('T')) {
        data = new Date(dataString)
      } else {
        data = new Date(dataString + 'T12:00:00')
      }

      if (!isValid(data)) {
        return '-'
      }

      return format(
        data,
        'dd/MM/yyyy',
        { locale: ptBR }
      )

    } catch {

      return '-'
    }
  }

  useEffect(() => {

    async function fetchResponsavel() {

      try {

        const response =
          await api.get(`/responsaveis/${id}`)

        setResponsavel(response.data.responsavel)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }
    }

    fetchResponsavel()

  }, [id])

  if (loading) {

    return (
      <div className='container'>
        Carregando...
      </div>
    )
  }

  if (!responsavel) {

    return (
      <div className='container'>
        Responsável não encontrado.
      </div>
    )
  }

  return (

    <div className='container'>

      <Link
        to='/'
        style={{
          textDecoration: 'none',
          color: '#2563eb',
          fontWeight: '600'
        }}
      >
        ⬅ Voltar
      </Link>

      <div
        className='card'
        style={{
          marginTop: '20px'
        }}
      >

        <h1 className='title'>
          {responsavel.nome}
        </h1>

        <p>
          📧 {responsavel.email}
        </p>

        <p>
          📱 {responsavel.telefone.replace(
          /^(\d{2})(\d)/g,
          '($1) $2'
        )}
        </p>

      </div>

      <div
        className='card'
        style={{
          marginTop: '20px'
        }}
      >

        <h2>
          Alunos vinculados
        </h2>

        {responsavel.alunos.length === 0 ? (

          <p>
            Nenhum aluno vinculado.
          </p>

        ) : (

          <table className='table'>

            <thead>

              <tr>

                <th>Nome</th>

                <th>Matrícula</th>

                <th>Data nascimento</th>

              </tr>

            </thead>

            <tbody>

              {responsavel.alunos.map(aluno => (

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

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}