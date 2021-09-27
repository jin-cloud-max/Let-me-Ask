import { useHistory, useParams } from 'react-router';


import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'

type RoomParams = {
   id: string;
}

export function AdminRoom() {
   const params = useParams<RoomParams>()
   const roomId = params.id

   const history = useHistory()
   
   const { title, questions } = useRoom(roomId)

   async function handleEndRoom() {
      await database.ref(`rooms/${roomId}`).update({
         endedAt: new Date(),
      })

      history.push('/')
   }

   async function handleDeleteQuestion(questionId: string) {
      if (window.confirm('Tem certeza que deseja deletar essa pergunta?')) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      }
   }

   async function handleCheckQuestionsAsAnswered(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
         isAnswered: true
      })
   }
   
   async function handleHighlightQuestion(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
         isHighlighted: true
      })
   }

   return (
      <div id="page-room">
         <header>
            <div className="content">
               <img src={logoImg} alt="Let me Ask" />
               <div>
                  <RoomCode code={roomId} />
                  <Button
                     isOutline
                     onClick={handleEndRoom}
                  >
                     Encerrar sala
                  </Button>
               </div>
            </div>
         </header>

         <main className="content">
            <div className="room-title">
               <h1>Sala {title}</h1>
               {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
            </div>

            
            <div className="question-list">
               {questions.map(question => (
                  <Question
                     key={question.id}
                     content={question.content}
                     author={question.author}
                     isAnswered={question.isAnswered}
                     isHighlighted={question.isHighlighted}
                  >
                     {!question.isAnswered && (
                        <>
                           <button
                           type="submit"
                           onClick={() => handleCheckQuestionsAsAnswered(question.id)}
                        >
                           <img src={checkImg} alt="Marcar como lida" />
                        </button>
                        <button
                           type="submit"
                           onClick={() => handleHighlightQuestion(question.id)}
                        >
                           <img src={answerImg} alt="Marcar como lida" />
                        </button>
                        </>
                     )}
                     <button
                        type="submit"
                        onClick={() => handleDeleteQuestion(question.id)}
                     >
                        <img src={deleteImg} alt="Deletar pergunta" />
                     </button>
                  </Question>
               ))}
            </div>
         </main>
      </div>
   )
}
