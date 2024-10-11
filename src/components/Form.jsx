import React from 'react';
import { Stack, Input, Radio, RadioGroup, ButtonGroup, Button, FormControl, FormLabel } from '@chakra-ui/react';

const TextInput = React.forwardRef((props, ref) => {
  return (
    <FormControl>
      <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
      <Input ref={ref} id={props.id} {...props} />
    </FormControl>
  );
});

const Form = ({
  firstFieldRef,
  onCancel,
  inputEventName,
  handleEventNameChange,
  inputEventType,
  handleCounterTypeChange,
  inputDate,
  handleInputChange,
}) => {
  return (
    <Stack spacing={4}>
      <TextInput
        label='Event name'
        id='event-name'
        autoFocus
        value={inputEventName}
        onChange={handleEventNameChange}
      />
      <RadioGroup value={inputEventType} onChange={handleCounterTypeChange}>
        <Stack spacing={5} direction='row'>
          <Radio colorScheme='green' value='future'>
            Future
          </Radio>
          <Radio colorScheme='green' value='ongoing'>
            Ongoing
          </Radio>
        </Stack>
      </RadioGroup>
      <Input
        type="date"
        label='Event date'
        id='event-date'
        value={inputDate}
        onChange={handleInputChange}
      />
      <ButtonGroup display='flex' justifyContent='flex-end'>
        <Button colorScheme='teal' onClick={onCancel}>
          Close
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default Form;
