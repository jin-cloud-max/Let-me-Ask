import { useParams } from 'react-router';


import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss'
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
   id: string;
}

export function AdminRoom() {
   const params = useParams<RoomParams>()
   const roomId = params.id
   
   const { title, questions } = useRoom(roomId)

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
