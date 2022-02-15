import { Anchor, AnchorExtendedProps, Avatar, Box, Button, Grommet, Header as GrommetHeader, Layer, Menu, Nav, Text } from 'grommet';
import React, { useState } from 'react';
import { Logout, Performance, Trash } from 'grommet-icons';
import { Link, LinkProps, useLocation, useNavigate } from 'react-router-dom';
import { deepMerge } from 'grommet/utils';
import { gql, useMutation } from '@apollo/client';
import { theme } from './theme';
import { useAuth } from './App';
import ListEdit from './list/edit/ListEdit';
import Settings from './settings/Settings';

/* eslint-disable */
export const AnchorLink: React.FC<AnchorLinkProps> = (props) => <Anchor as={Link} {...props} />;

export type AnchorLinkProps = LinkProps & AnchorExtendedProps;
/* eslint-enable */

const GQL_MUTATION_UPDATE_FAVOURITE_STATUS = gql`
  mutation UpdateFavouriteStatus($listId: ID!, $favourite: Boolean) {
    updateFavouriteStatus(listId: $listId, favourite: $favourite)
  }
`;

export interface IUpdateFavouriteStatusVars {
  listId: string;
  favourite: boolean;
}

export interface IUpdateFavouriteStatus {
  updateFavouriteStatus: boolean;
}

const headerTheme = deepMerge(theme, {
  button: {
    extend: () => `
      background: #14181c;
      color: #ffffff;  
      &:focus {
        box-shadow: none;
        border-color: initial;
        background: #14181c;
        color: #ffffff;
      }
      &:hover {
        background: #678;
        color: #ffffff; 
      }
    `,
    drop: () => `
      background: #14181c;
      color: #ffffff;  
      &:focus {
        box-shadow: none;
        border-color: initial;
        background: #14181c;
        color: #ffffff;
      }
    `,
  },  
});

function Header() {
  const auth = useAuth();

  const [updateFavouriteStatus] = useMutation<IUpdateFavouriteStatus, IUpdateFavouriteStatusVars>(GQL_MUTATION_UPDATE_FAVOURITE_STATUS);
  
  const [showSettingsLayer, setShowSettingsLayer] = useState(false);  
  const [showEditLayer, setShowEditLayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const onFavouriteDragStart = (event: React.DragEvent, id: string) => {
    event.dataTransfer.setData("id", id);
    setIsDragging(true);
  }

  const favourites = auth?.user?.bookmarks.filter(e => e.favourite).map(e => {
    const to = `/list/${e.list._id}`;
    return (
      <AnchorLink size="xsmall" key={e.list._id} as={Link} color="white" label={e.list.name} to={to}
        draggable 
        onDragStart={(event: React.DragEvent) => onFavouriteDragStart(event, e.list._id)}
        onDragEnd={() => {setIsDragging(false)}}
      />
    )
  });

  const bookmarks = auth?.user?.bookmarks?.filter(e => !e.own).map(e => ({ label: e.list.name, onClick: () => {navigate(`/list/${e.list._id}`);} }));

  const ownLists = auth?.user?.lists?.map(e => (
    {
      label: (<Text data-list-id={e._id}>{e.name}</Text>),
      onClick: () => {navigate(`/list/${e._id}`);},
      justify: 'start'}))?.concat(
    {
      label: (<Text size="small" id="createList"><i>create...</i></Text>),
      onClick: () => {setShowEditLayer(true)},
      justify: 'center'
    }
  )

  const onDrop = (event: React.DragEvent) => {
    const id = event.dataTransfer.getData('id');
    updateFavouriteStatus({ variables: { listId: id, favourite: true } }).then(() => {
      auth?.refresh(() => {});
    })
  }

  const onTrashDrop = (event: React.DragEvent) => {
    event.stopPropagation();
    const id = event.dataTransfer.getData('id');
    updateFavouriteStatus({ variables: { listId: id, favourite: false } }).then(() => {
      auth?.refresh(() => {});
    })
    setIsDragging(false);
  }


  const onEditLayerClose = (updated: boolean, id?: string) => {
    setShowEditLayer(false);    
    if (updated && id) {
      /*
      currentUserQuery.refetch().then(() => {
        navigate(`/list/${id}`);
      })
      */
    }
  }

  const onSettingsLayerClose = () => {
    setShowSettingsLayer(false);
  }


  const logout = () => auth?.signout(() => { navigate('/', { replace: true }) });

  if (location.pathname === '/' || !auth?.user) {
    return (
      <Grommet theme={theme} />
    )
  }

  return (
    <Grommet theme={headerTheme}>
      {showSettingsLayer && (
      <Layer animation="fadeIn" modal onEsc={() => {onEditLayerClose(false)}} position='top' margin={{top: '200px'}}>
        <Settings onClose={() => onSettingsLayerClose()}/>
      </Layer>
      )}      
      {showEditLayer && (
      <Layer animation="fadeIn" modal onEsc={() => {onEditLayerClose(false)}} position='top' margin={{top: '200px'}}>
        <ListEdit
          id=""
          name=""
          description=""
          url=""
          isPublic
          onClose={(updated, id) => onEditLayerClose(updated, id)}/>
      </Layer>
      )}
      {auth?.user &&
      <>
        <GrommetHeader background="background_dark_1" pad="small" flex={false} animation="slideDown">
          <Box direction="row" align="center" gap="medium" width="500px">
            <Avatar src={`${process.env.REACT_APP_BACKEND_BASE_URL}/avatar_placeholder.png`}/>
            <Anchor color="white" href="">
              <Text>{auth?.user?.username}</Text>
            </Anchor>         
            <Performance onClick={() => setShowSettingsLayer(true)}/>
            <Logout onClick={logout}/>               
          </Box>
          <Box direction="row" align="center" gap="small" width="fill">
            <Text>
              <AnchorLink as={Link} color="white" label="Coming Soonish ™" to="/coming-soon"/>
            </Text>
          </Box>          
          <Nav direction="row" justify="center" gap='medium' width="500px" align="center">
            <AnchorLink as={Link} color="white" to="/coming-soon" margin={{right: '15px'}}>
              <Text weight="normal">Coming Soonish</Text>
            </AnchorLink>
            {bookmarks &&
            <Menu
              id="bookmarks"
              dropAlign={{ top: "bottom", right: "right" }}            
              dropProps={{elevation: 'none'}}
              label="Bookmarks"
              items={bookmarks}
            />           
            }
            {ownLists &&
            <Menu
              id="lists"
              dropAlign={{ top: "bottom", right: "right" }}
              dropProps={{elevation: 'none' }}            
              label="Lists"
              items={ownLists}
            />        
            }                       
          </Nav>  
        </GrommetHeader>
        <GrommetHeader background="background_dark_2" height="33px" flex={false} animation="slideUp"
          onDragOver={(event) => {event.preventDefault();}}
          onDrop={onDrop}
        >
          <Nav direction="row" fill>
            <Box fill="horizontal" gap="medium" pad={{left: 'small'}} align="center" justify="start" direction="row" border={[{'side': 'top', size:'small'}, {'side': 'bottom', size: 'small'}]}>
              {favourites && favourites.length > 0 ?
              <Box direction='row' gap='medium' align="center">
                {favourites}
                {isDragging &&
                <Button plain icon={<Trash color="white" size="15px"/>} style={{padding: '4px', borderRadius: '4px', backgroundColor:"#14181c"}}
                  onDragOver={(event) => {event.preventDefault();}}
                  onDrop={onTrashDrop}
                />
                }
              </Box>
              :
              <Text size="small" color="white"><i>drag lists here to create shortcuts...</i></Text>
              }
            </Box> 
          </Nav>
        </GrommetHeader>
      </>
      }
    </Grommet>
  )
}

export default Header;
