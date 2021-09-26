import { useHistory, useParams } from 'react-router';


import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

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
                  >
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
