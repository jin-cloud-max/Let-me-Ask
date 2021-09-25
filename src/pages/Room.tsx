import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss'

type RoomParams = {
   id: string;
}

type FirebaseQuestions = Record<string, {
   author: {
      name: string;
      avatar: string;
   }
   content: string;
   isHighlighted: boolean;
   isAnswered: boolean;
}>

type QuestionsProps = {
   id: string;
    author: {
      name: string;
      avatar: string;
   }
   content: string;
   isHighlighted: boolean;
   isAnswered: boolean;
}

export function Room() {
   const { user } = useAuth()

   const params = useParams<RoomParams>()
   const roomId = params.id
   
   const [newQuestion, setNewQuestion] = useState('')
   const [questions, setQuestions] = useState<QuestionsProps[]>([])
   const [title, setTitle] = useState('')

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

   useEffect(() => {
      const roomRef = database.ref(`rooms/${roomId}`)

      roomRef.on('value', room => {
         const databaseRoom = room.val()
         const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

         const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
               id: key,
               content: value.content,
               author: value.author,
               isAnswered: value.isAnswered,
               isHighlighted: value.isHighlighted
            }
         })

         setTitle(databaseRoom.title)
         setQuestions(parsedQuestion)
      })

   }, [roomId])

   return (
      <div id="page-room">
         <header>
            <div className="content">
               <img src={logoImg} alt="Let me Ask" />
               <RoomCode code={roomId}/>
            </div>
         </header>

         <main className="content">
            <div className="room-title">
               <h1>Sala {title}</h1>
               {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
            </div>

            <form onSubmit={handleSendQuestion}>
               <textarea
                  placeholder="O que você quer perguntar"
                  onChange={event => setNewQuestion(event.target.value)}
                  value={newQuestion}
               />

               <div className="form-footer">
                  {user ? (
                     <div className="user-info">
                        <img src={user.avatar} alt={user.name} />
                        <span>{user.name}</span>
                     </div>
                  ) : (
                     <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                  )}
                  <Button type="submit" disabled={!user}>Enviar pergunta</Button>
               </div>
            </form>

            {JSON.stringify(questions)}
         </main>
      </div>
   )
}
