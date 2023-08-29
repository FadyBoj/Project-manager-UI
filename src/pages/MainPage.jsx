import React from 'react';

//components
import Header from '../components/Header';
import Task from '../components/Task';
import Lottie from 'lottie-react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

//animation
import taskAnimation from '../assets/task-lottie.json';

const MainPage = () => {
    const [cardAdded,setCardAdded] = React.useState(false);
    const checkCard = () =>{
      setCardAdded(prevValue => !prevValue)
    }
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const [name,setName] = React.useState('');
      const [taskChanged,setTaskChanged] = React.useState(0);

      const handleNameChange = (e)=>{
        setName(e.target.value)
      };

      const [nameError,setError] = React.useState('');
      
      const handleSubmit = async()=>{
        if(name.length === 0)
        {
           return setError('Please provide a title')
        }
        else if(name.length < 4)
        {
           return setError('Title must be 4 characters or more')

        }

        const options = {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({title:name})
        }
        try {
          const response = await fetch('http://localhost:8000',options);
          const data = await response.json();
          setTaskChanged(prevValue => prevValue + 1);
          setOpen(false)
        } catch (error) {
          console.log(error);
        }
        
      }

      //fetching tasks

      const [tasks,setTasks] = React.useState([]);

      React.useEffect(()=>{
        const getTasks = async() =>{
          const response = await fetch('http://localhost:8000/get-tasks');
          const serverTasks = await response.json();
          setTasks(serverTasks);
        } 
        

        getTasks();
      },[taskChanged,cardAdded]);


      // creating task elements

      const taskElements = tasks.map((task,index) =>{
        return <Task 
        key={index + 1}
        id={task.ID}
        title={task.NAME}
        cards={task.CARDS}
        cardAdded={checkCard}
          />
      })

  return (
    <div className='main-page'>
            <Header openDialog={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create a new task</DialogTitle>
                <DialogContent>
                <DialogContentText>
                        To create a new task , Please enter the task title here. It
                        will be Saved here.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Task title"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={handleNameChange}
                    error={nameError.length < 0 ? true :false}
                    helperText={nameError}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create</Button>
                </DialogActions>
            </Dialog>

            <div className='tasks'>

              {tasks.length === 0 ? 
              <div className='empty-div'> 
              <Lottie on className='animated-task' animationData={taskAnimation}/>
              </div>:
              taskElements
              }
            </div>
            
    </div>
  )
}

export default MainPage