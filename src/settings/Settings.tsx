import React, { useEffect, useState } from 'react';
import { Button, Text, Box,TextInput, CheckBox } from 'grommet';
import { useMutation } from '@apollo/client';
import { useAuth } from '../App';
import { IMutationDeleteAccount, IMutationDeleteAccountVars, IMutationUpdateAccount, IMutationUpdateAccountVars, ISetting } from './Settings.interface';
import { GQL_MUTATION_DELETE_ACCOUNT, GQL_MUTATION_UPDATE_ACCOUNT } from './Settings.gql';

export interface IProps {
  onClose: (deleted: boolean) => void;
}


function Settings({onClose}: IProps
  ) {
  const auth = useAuth();

  const [showDelete, setShowDelete] = useState(false);

  const [username, setUsername] = useState('')
  const [deleteInput, setDeleteInput] = useState('');
  const [germanyChecked, setGermanyChecked] = useState(false);
  const [unitedStatesChecked, setUnitedStatesChecked] = useState(false);
  
  const [updateAccount] = useMutation<IMutationUpdateAccount, IMutationUpdateAccountVars>(GQL_MUTATION_UPDATE_ACCOUNT);
  const [deleteAccount] = useMutation<IMutationDeleteAccount, IMutationDeleteAccountVars>(GQL_MUTATION_DELETE_ACCOUNT);

  useEffect(() => {
    if (auth?.user) {
      setUsername(auth.user.username);
      const countries = auth.user.settings.find((e: ISetting) => e.key === 'countries')
      if (countries) {
        if (countries.values.includes('US')) {
          setUnitedStatesChecked(true);
        }
        if (countries.values.includes('DE')) {
          setGermanyChecked(true);
        }
      }
    }
  }, [auth])

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  }

  const onDeleteInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteInput(event.currentTarget.value);
  }

  const onSaveClick = () => {
    const settings: ISetting[] = [];
    const countries: string[] = [];

    if (unitedStatesChecked) {
      countries.push('US');
    }
    if (germanyChecked) {
      countries.push('DE');
    }

    settings.push({
      key: 'countries',
      values: countries,
    });

    updateAccount({ variables: 
      { username, settings } 
    }).then(() => {
      auth?.refresh(() => {});
      onClose(false);
    })
  }

  const onDeleteClick = () => {
    if (deleteInput === '') {
      setShowDelete(true);
    } else if (deleteInput === 'DELETE') {
      deleteAccount().then(() => {})   
    }
  }

  return (
    <Box fill align="center" justify="center" border={{ color: 'white', size: 'xsmall' }} round background="background_dark_1">
      <Box width="medium" margin="medium">
        <Box direction="column" pad={{bottom: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
          <Text color="text_dark_1" margin={{left: '13px'}}>Username</Text>
          <TextInput name="name" value={username} placeholder="Username" spellCheck={false} onChange={onUsernameChange} />
        </Box>
        <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small">
        <Box direction="column">
            <Text color="text_dark_1" margin={{left: '13px'}}>Countries</Text>
            <Text color="text_dark_1" margin={{left: '13px'}} size="xsmall">show release dates &amp; watch providers for selected countries</Text>
          </Box>
          <CheckBox checked={unitedStatesChecked} label="United States" onChange={() => {setUnitedStatesChecked(!unitedStatesChecked)}} />
          <CheckBox checked={germanyChecked} label="Germany" onChange={() => {setGermanyChecked(!germanyChecked)}} />            
        </Box>
        {showDelete &&
        <Box direction="column" pad={{bottom: '20px', top: '20px'}} border={{side: 'bottom', size: 'xsmall'}} gap="small" animation="fadeIn">
          <Box direction="column">
            <Text color="text_dark_1" margin={{left: '13px'}}>Delete</Text>
            <Text color="text_dark_1" margin={{left: '13px'}} size="xsmall">type in <b>DELETE</b> and click &apos;Delete Account&apos; again</Text>
          </Box>
          <TextInput name="delete" value={deleteInput} placeholder="" onChange={onDeleteInputChange}/>
        </Box>
        }                                             
        <Box direction="row" justify="between" margin={{ top: 'medium' }}>
          <Button label="Cancel" onClick={() => {onClose(false)}} color="white" size="small" style={{borderRadius: '10px'}} />
          <Button label="Delete account" size="small" style={{borderRadius: '10px'}} color='white'
            disabled={showDelete && deleteInput !== 'DELETE'}
            onClick={onDeleteClick}
          />
          <Button type="submit" label='Save' color="white" size="small" style={{borderRadius: '10px'}} onClick={onSaveClick}/>
        </Box>
      </Box>
    </Box>
  )
}

export default Settings;