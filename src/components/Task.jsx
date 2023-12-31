import React from 'react'
import Lottie from 'lottie-react';
import EditModal from './Edit-Modal';


//icons
import DropDown from './DropDown';
import { BsThreeDots ,BsCalendar2Plus } from 'react-icons/bs';
import { AiOutlinePlus,AiOutlineClose } from 'react-icons/ai';
import { BiSolidEdit } from 'react-icons/bi';
import tick from '../assets/tick-animation.json';
import tickStatic from '../assets/tick.svg'
const Task = (props) => {

    const [cardId,setCardId] = React.useState(null);
    const [editOpen,setEditOpen] = React.useState(false);

    const handleOpen = (id) =>{
        setEditOpen(!editOpen)
        setCardId(id)
    }
    const handleClose = () => setEditOpen(false);

    const [justDone,setJustDone] = React.useState(false);
    const Section = (props)=>{
        return(
            <div onClick={()=>handleOpen(props.id)}  className='section'>
                <div className='s-text'>{props.text}</div>
                { props.done &&
                <div>
                    
                <div><img className={`tick-animation ${!justDone ? 'show-tick' : ''} `} src={tickStatic}/></div>

                <div ><Lottie autoPlay={false}
                 className={`tick-animation ${justDone ? 'show-tick' : ''} `} loop={false} animationData={tick} /></div>

                 </div>
                }
            </div>
        )
    }



    //handle mouseDown

    const dropBtnRef = React.useRef();
    const handleMouseDown = () =>{
        dropBtnRef.current.classList.add('drop-mouse-down');
    }

    const handleMouseUp = () =>{
        dropBtnRef.current.classList.remove('drop-mouse-down');
    }


  // handle dropdown

  const [isOpen,setIsOpen] = React.useState(false);
  const dropDownRef = React.useRef();

  const showMenu = () =>{
    setIsOpen(prevValue => !prevValue);
  }

  //handle click outside
  
  React.useEffect(()=>{
    const handleClickOutside = (event)=>{   
        if(dropDownRef.current && !dropDownRef.current.contains(event.target) && !dropBtnRef.current.contains(event.target))
        {
            setIsOpen(false)
        }
    }   

    document.addEventListener('click',handleClickOutside);

    return () =>{
        document.removeEventListener('click',handleClickOutside)
    }

  })

  // Adding a card
  const [isAdding,setIsAdding] = React.useState();
  const cardsParentRef = React.useRef();
  const cardInputRef = React.useRef();
  const addBtnRef = React.useRef();
  
  const addCard = () =>{
    setTimeout(()=>{

        cardsParentRef.current.scrollTop = cardsParentRef.current.scrollHeight;
    },1)
    setIsAdding(true);
    setTimeout(() => {
        cardInputRef.current.focus();
      }, 0);   
  }

  // handle clicking outside card input



  // sending card info to the server

  const [cardText,setCardText] = React.useState('')
  const [savedByBtn,setSavedByBtn] = React.useState(false);

  const cardInputChange = (e)=>{
    const text = e.target.textContent;
    setCardText(text)
  }

  



  const saveCard = async(e)=>{

    if(cardText.length > 0){

    const options = {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({value:cardText,id:props.id})
    }

    const response = await fetch('http://localhost:8000/add-card',options);
    props.addCard(props.id,cardText);

    cardInputRef.current.textContent = ''
    setCardText('');
    setTimeout(() => {
        cardInputRef.current.focus();
      }, 0);   

    }

  } 

  const [taskDeleted,setTaskDeleted] = React.useState(false);


  
  let cardElements = []

  if(props.cards)
  {
    cardElements =  props.cards.map((card,index) =>{
        return <Section done={card.completed} key={index} id={index} text={card.value}/>
    })
  }


  const addCardBtnRef = React.useRef();

  React.useEffect(() =>{
    const handleClickOutside = (e) =>{
        if(cardInputRef.current && !cardInputRef.current.contains(e.target) && !addBtnRef.current.contains(e.target) 
        && !addCardBtnRef.current.contains(e.target))
        {
            setIsAdding(false);
            setCardText('')
           
        }
    }

    document.addEventListener('click',handleClickOutside);

    return () =>{
        document.removeEventListener('click',handleClickOutside);
    }

  })


  

  return (
    <div style={taskDeleted ? {display:'none'}:{}} className='task'>
        <div className='task-title'>
            <div>{props.title}</div>
            <div>
                

            </div>

            <div  ref={dropBtnRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={showMenu}
            >
                
                <DropDown deleteTask={props.deleteTask} id={props.id} title={props.title}   />
            </div>
            
        </div>
        <div ref={cardsParentRef} className='sections'>


            {cardElements}




            { isAdding &&
            <div className='add-card-component'>
                <span onInput={cardInputChange}  ref={cardInputRef} className='add-card-input' contentEditable={true}></span> 
            </div>
            }
        </div>

        

        <div className='add-card'>

            <div className='confirm-card' style={isAdding?{display:'flex'}:{display:'none'}}>
                <div ref={addCardBtnRef} onClick={saveCard} className='confirm-card-btn'>Add card</div>
                <div><AiOutlineClose className='close-btn' size={24}/></div>
            </div>

            <div className='add-card-btn'
                 onClick={addCard}
                 ref={addBtnRef}
                 style={!isAdding?{display:'flex'}:{display:'none'}}
            >
                <div><AiOutlinePlus className='card-plus' size={17}/></div>
                <div>Add a card</div>
            </div>
            
        </div>
            { editOpen && 
        <EditModal 
        handleTaskChange={props.handleTaskChange}
        taskId={props.id}
        cardId={cardId}
        handleClose={handleClose}
        isOpen={editOpen}
        setOpen={setEditOpen} />
            }

    </div>
  )
}

export default Task