import React from 'react'

export const DropDownSec = (props) => {

    React.useEffect(() =>{
        const handleClickOutside = (e) =>{
          
            if(props.refs.current && !props.refs.current.contains(e.target))
            {
                props.hide()
            }
         
        }

        document.addEventListener('click',handleClickOutside);

        return ()=>{
        console.log('cleaned')
        document.removeEventListener('click',handleClickOutside);
        }
    },[0])

  return (
    <div ref={props.refs} className='drop-down-sec'></div>
    )
}
