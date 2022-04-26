import { useMemo, useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';



const GenericTextField = ({ textTitle, inputValue, handleOnChange, placeHolder, errorValue, errors }) => {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (placeHolder && isNaN(placeHolder)) {
      setLabel(placeHolder.substring(0, 11))
    } else if (placeHolder && !isNaN(placeHolder)) {
      setLabel(placeHolder.toString().substring(0,11))
    } else {
      setLabel(`Enter ${textTitle}`)
    }

  }, [placeHolder, textTitle, inputValue]) 


  const GenericInput = useMemo(() => {
    return <TextField 
    type="text" 
    fullWidth 
    required 
    value={inputValue} 
    onChange={(e) => handleOnChange(e.target.value)} 
    size="small" 
    id="outlined-basic" 
    label={label} 
    variant="outlined" 
    helperText={errors[errorValue]}
    />
  }, [errorValue, errors, handleOnChange, inputValue, label])

  return GenericInput
}

export default GenericTextField;
