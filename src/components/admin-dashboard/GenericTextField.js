import { useMemo, useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';



const GenericTextField = ({ isReadOnly=false, isMultiline=false, mnRows=0, textTitle, inputType="text", inputValue, handleOnChange, placeHolder, errorValue, errors }) => {
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
    fullWidth 
    required 
    value={inputValue ?? ""} 
    onChange={(e) => handleOnChange(e.target.value)} 
    size="small" 
    id="outlined-basic" 
    label={label} 
    variant="outlined" 
    helperText={errors[errorValue]}
    type={inputType}
    multiline={isMultiline}
    minRows={mnRows}
    InputProps={{
      readOnly: isReadOnly,
    }}
    />
  }, [errorValue, errors, handleOnChange, inputValue, label, inputType, isMultiline, mnRows, isReadOnly])

  return GenericInput
}

export default GenericTextField;
