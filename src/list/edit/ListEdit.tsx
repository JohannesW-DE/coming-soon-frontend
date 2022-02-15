import React, { useState } from 'react';
import { Button, Text, Box, TextArea, Form, TextInput, RadioButtonGroup, FormExtendedEvent } from 'grommet';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ICreateList, ICreateListVars, IDeleteList, IDeleteListVars, IUpdateListDetails, IUpdateListDetailsVars } from './ListEdit.interface';
import { GQL_MUTATION_CREATE_LIST, GQL_MUTATION_DELETE_LIST, GQL_MUTATION_UPDATE_LIST_DETAILS } from './ListEdit.gql';
import { useAuth } from '../../App';


export interface IProps {
  id: string;
  name: string;
  description: string;
  url: string;
  isPublic: boolean;
  onClose: (success: boolean, id?: string) => void;
}

interface IValue extends IProps {
  delete: string;
}

function ListEdit({id, name, description, url, isPublic, onClose}: IProps
  ) {
  const auth = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState<IValue>({id, name, description, url, isPublic, onClose, delete: ''});
  const [showDelete, setShowDelete] = useState(false);

  const [updateListDetails] = useMutation<IUpdateListDetails, IUpdateListDetailsVars>(GQL_MUTATION_UPDATE_LIST_DETAILS);
  const [createList] = useMutation<ICreateList, ICreateListVars>(GQL_MUTATION_CREATE_LIST);
  const [deleteList] = useMutation<IDeleteList, IDeleteListVars>(GQL_MUTATION_DELETE_LIST);

  const onVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue({...value, isPublic: (event.target.value === 'public')}); 
  }

  const onSubmit = (event: FormExtendedEvent<IProps, Element>) => {
    if (value.id === '') { // create new list
      createList({ variables: 
        { name: value.name, description: value.description, isPublic: value.isPublic, url: value.url } 
      }).then((result) => {
        if (result.data && result.data.createList !== '') {
          auth?.refresh(() => {navigate(`/list/${result.data?.createList}`);})
          onClose(true);      
        } else {
          onClose(false, '');
        }
      })
    } else if (Object.keys(event.touched).length > 0) {
      updateListDetails({ variables: 
        { id: value.id, name: value.name, description: value.description, isPublic: value.isPublic, url: value.url } 
      }).then((result) => {
        if (result.data?.updateListDetails) {
          onClose(true);
          auth?.refresh(() => {});
        } else {
          onClose(false);
        }
      })
    } else {
      onClose(false);
    }
  }

  const onDeleteClick = () => {
    if (value.delete === '') {
      setShowDelete(true);
    } else if (value.delete === value.name) {
      deleteList({ variables: 
        { id } 
      }).then((result) => {
        if (result.data?.deleteList) {
          auth?.refresh(() => {navigate(`/coming-soon`);})
        } else {
          auth?.refresh(() => {navigate(`/list/${id}`);})
        }
      })      
    }
  }

  return (
    <Box fill align="center" justify="center" border={{ color: 'white', size: 'xsmall' }} round background="background_dark_1">
      <Box width="medium" margin="medium">
        <Form
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);
          }}
          onSubmit={onSubmit}
        >
          <Box direction="column" pad={{bottom: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
            <Text color="text_dark_1" margin={{left: '13px'}}>Name</Text>
            <TextInput id="name" name="name" value={value.name} placeholder="Name" spellCheck={false} />
          </Box>
          <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
            <Text color="text_dark_1" margin={{left: '13px'}}>Description</Text>
            <TextArea id="description" name="description" value={value.description} resize="vertical" placeholder="A short description" spellCheck={false}/>
          </Box>
          <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
            <Text color="text_dark_1" margin={{left: '13px'}}>URL</Text>
            <TextInput id="url" name="url" value={value.url} placeholder="www" spellCheck={false}/>
          </Box>
          <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
            <Text color="text_dark_1" margin={{left: '13px'}}>Visibility</Text>
            <RadioButtonGroup
              justify='end'
              direction="row"
              name="visibility"
              value={value.isPublic ? 'public': 'private'}
              onChange={onVisibilityChange}
              options={ [{label: 'public', value: 'public'}, {label: 'private', value: 'private'} ] }
            />              
          </Box>
          {showDelete &&
          <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small" animation="fadeIn">
            <Box direction="column">
              <Text color="text_dark_1" margin={{left: '13px'}}>Delete</Text>
              <Text color="text_dark_1" margin={{left: '13px'}} size="xsmall">type in name of the list and click delete again</Text>
            </Box>
            <TextInput name="delete" value={value.delete} placeholder="name of the list"/>
          </Box>
          }                                             
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button id="cancel" label="Cancel" onClick={() => {onClose(false)}} color="white" size="small" style={{borderRadius: '10px'}} />
            {id !== '' &&
            <Button id="delete" label="Delete" size="small" style={{borderRadius: '10px'}} color="white"
              disabled={showDelete && value.name !== value.delete}
              onClick={onDeleteClick}
            />
            }
            <Button id="submit" type="submit" label={id === '' ? 'Create' : 'Update'} color="white" size="small" style={{borderRadius: '10px'}}/>
          </Box>
        </Form>
      </Box>
    </Box>
  )
}

export default ListEdit;