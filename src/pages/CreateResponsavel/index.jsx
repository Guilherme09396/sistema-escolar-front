import React, { useState } from 'react'

import {
  useNavigate,
  useLocation,
  Link
} from 'react-router-dom'
import { api } from '../../services/api'


export default function CreateResponsavel(){
  const navigate = useNavigate()
  const location = useLocation()
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(false)
  

  const [fieldErrors, setFieldErrors] = useState({})


  const handleSubmit = async (e) => {
      e.preventDefault()

    try {

      setLoading(true)

      // LIMPAR ERROS
      setFieldErrors({})
      const payload = {nome, email, telefone: telefone.replace(/\D+/g, '')};
      const resultado = await api.post('/responsaveis/criar', payload);

      showNotification(
      'success',
      'Responsável cadastrado com sucesso! Redirecionando...'
      )

      setTimeout(() => {

      navigate('/alunos/criar', {
        state: {
          formData:
            location.state?.formData,

          novoResponsavel:
            resultado.data
        }
      })

      }, 2000)
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
          error?.response?.data?.error
          ||
          'Erro ao cadastrar responsável'
        )

      }
    } finally {

      setLoading(false)

    }


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

return(
<div className='container'>
  <Link
          to='/alunos/criar'
          style={{
            textDecoration: 'none',
            color: '#2563eb',
            fontWeight: '600'
          }}
        >
          ⬅ Voltar
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
<h1 className='title'>Cadastrar responsável</h1>
<p>Preencha os dados</p>
</div>
</div>

<div className='card'>

<form onSubmit={handleSubmit} action="">

<div className='form-group'>
<label className='label'>Nome</label>
<input value={nome} onChange={(e) => setNome(e.target.value)} className='input' placeholder='Digite o nome' />
</div>
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
<div className='form-group'>
<label className='label'>Email</label>
<input value={email} onChange={(e) => {setEmail(e.target.value)}} className='input' placeholder='Digite o email' />
</div>

{fieldErrors.email && (

              <div
                style={{
                  color: '#dc2626',
                  marginTop: '-10px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}
              >

                {fieldErrors.email.map(
                  (error, index) => (
                    <div key={index}>
                      {error}
                    </div>
                  )
                )}

              </div>

            )}

<div className='form-group'>
<label className='label'>
    Telefone
  </label>

  <input
    className='input'
    placeholder='(00) 00000-0000'
    value={telefone}

    maxLength={15}

    onChange={(e) => {

      let value = e.target.value

      // remove tudo que não for número
      value = value.replace(/\D/g, '')

      // limita em 11 números
      value = value.slice(0, 11)

      // aplica máscara
      value = value.replace(
        /^(\d{2})(\d)/g,
        '($1) $2'
      )

      value = value.replace(
        /(\d{5})(\d)/,
        '$1-$2'
      )

      setTelefone(value)
    }}
  />
</div>

{fieldErrors.telefone && (

              <div
                style={{
                  color: '#dc2626',
                  marginTop: '-10px',
                  marginBottom: '12px',
                  fontSize: '14px'
                }}
              >

                {fieldErrors.telefone.map(
                  (error, index) => (
                    <div key={index}>
                      {error}
                    </div>
                  )
                )}

              </div>

            )}

<button className='button'disabled={loading}
          >

            {loading
              ? 'Salvando...'
              : 'Salvar responsável'
            }
</button>
</form>


</div>

</div>
)
}