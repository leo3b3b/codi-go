import { useNavigate } from 'react-router-dom'

const classes = [
  {
    id: 'A1',
    name: 'Turma A1',
    description: 'Aventureiros da turma A1',
  },
  {
    id: 'A2',
    name: 'Turma A2',
    description: 'Aventureiros da turma A2',
  },
  {
    id: 'A3',
    name: 'Turma A3',
    description: 'Aventureiros da turma A3',
  },
]

export function ClassesPage() {
  const navigate = useNavigate()

  function handleClassClick(classId: string) {
    console.log('Turma selecionada:', classId)

    // Por enquanto, vamos apenas guardar a turma selecionada.
    // A tela dos alunos será criada na próxima etapa.
    navigate(`/teacher/classes/${classId}`)
  }

  return (
    <main className="classes-page">
      <header className="classes-header">
        <div>
          <p className="classes-eyebrow">Área do professor</p>

          <h1>Escolha a turma</h1>

          <p className="classes-subtitle">
            Selecione uma turma para acompanhar seus alunos.
          </p>
        </div>

        <div className="classes-decoration" aria-hidden="true">
          ★
        </div>
      </header>

      <section className="classes-grid">
        {classes.map((classItem) => (
          <button
            key={classItem.id}
            type="button"
            className="class-card"
            onClick={() => handleClassClick(classItem.id)}
          >
            <div className="class-card-icon">
              {classItem.id}
            </div>

            <div className="class-card-content">
              <h2>{classItem.name}</h2>

              <p>{classItem.description}</p>
            </div>

            <span className="class-card-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </section>
    </main>
  )
}