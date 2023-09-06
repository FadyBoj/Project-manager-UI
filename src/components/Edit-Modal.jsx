import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, styled } from '@mui/system';
import { Modal } from '@mui/base/Modal';
import Fade from '@mui/material/Fade';
import { Button } from '@mui/base/Button';
import { toast } from 'sonner'
//Icons
import { BsTextParagraph } from 'react-icons/bs'
import { BsFillClipboardCheckFill } from 'react-icons/bs';
export default function EditModal(props) {



  const editBoxStyle ={
    width:'600px',
    minHeight:'300px',
    backgroundColor:'#282e33',
    color:'white',
    borderRadius:'14px',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    paddingTop:'20px',
    outline:'unset',
    gap:'30px'

  }

   const [cardValue,setCardValue] = React.useState('');
   const [cardState,setCardState] = React.useState(null);
   


      React.useEffect(()=>{
        const response =  fetch(`http://localhost:8000/get-single-card/${props.taskId}/${props.cardId}`)
      .then((res)=>res.json())
      .then((d)=> {
        setCardValue(d.card.value)
        setCardState(d.card.completed)
      });
      },[0])

      
     const handleChange = (e) =>{
      setCardValue(e.target.value)
     }

     // handle save

     const handleSave = async()=>{
      const data = {value:cardValue,taskId:props.taskId,cardId:props.cardId}
      const options = {
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      }
      try {
       const response = await fetch('http://localhost:8000/update-card',options);
       const data = await response.json();
       if(response.status !== 200)
       {
        toast.error(data.msg);
       }
       else{
        props.handleTaskChange()
        toast.success('Successfully updated your card');
        props.setOpen(false)
       }
      
      } catch (error) {
        console.log(error)
      }

     }

     // handle delete
     const handleDelete = async()=>{
      const data = {taskId:props.taskId,cardId:props.cardId}
      const options = {
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      }

      try {
        await fetch('http://localhost:8000/delete-card',options);
        props.handleTaskChange()
        toast.success('Successfully Deleted your card');
        props.setOpen(false)
      } catch (error) {
        console.log(error)
      }
     }

  return (
    <div>
      <StyledModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.isOpen}
        onClose={props.handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={props.isOpen}>
          <Box  sx={editBoxStyle}>
            <div className='desc-cont'>
              <div className='description'>
                <BsTextParagraph className='description-icon' size={20}/>
                <div>Description</div>
              </div>  

              <div><textarea value={cardValue} onInput={handleChange} className='edit-input' contentEditable={true}></textarea></div>
            </div>

            <div className='status'>
              <BsFillClipboardCheckFill size={18} />
              <div>Status : {cardState ? <span className='card-status'>Done</span>:<span className='card-status'>Not completed</span>}</div>

            </div>

            <div className='card-btn-cont'>
              <button className='complete-btn'>Set as completed</button>
            </div>

            <div className='save-delete'>
              <button onClick={handleDelete}  className='delete-btn'>Delete</button>
              <button onClick={handleSave} className='save-btn'>Save</button>
            </div>

          </Box>
        </Fade>
      </StyledModal>
    </div>
  );
}

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

Backdrop.propTypes = {
  open: PropTypes.bool,
};

const blue = {
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: '12px',
  padding: '16px 32px 24px 32px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  boxShadow: `0px 2px 24px ${theme.palette.mode === 'dark' ? '#000' : '#383838'}`,
});

const TriggerButton = styled(Button)(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  border-radius: 12px;
  padding: 6px 12px;
  line-height: 1.5;
  background: transparent;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]};

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &:focus-visible {
    border-color: ${blue[400]};
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }
  `,
);
