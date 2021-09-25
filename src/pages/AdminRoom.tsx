import { FormEvent, useState } from 'react';
import { useParams } from 'react-router';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
   id: string;
}

export function AdminRoom() {
   const { user } = useAuth()

   const params = useParams<RoomParams>()
   const roomId = params.id
   
   const [newQuestion, setNewQuestion] = useState('')

   const { title, questions } = useRoom(roomId)

   async function handleSendQuestion(e: FormEvent) {
      e.preventDefault()

      if (newQuestion.trim() === '') {
         return;
      }

      if (!user) {
         throw new Error('Você tem que estar logado para enviar a pergunta.')
      }

      const question = {
         content: newQuestion.trim(),
         author: {
            name: user.name,
            avatar: user.avatar
         },
         isHighlighted: false,
         isAnswered: false
      }

      await database.ref(`rooms/${roomId}/questions`).push(question)

      setNewQuestion('')
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
                  />
               ))}
            </div>
         </main>
      </div>
   )
}
