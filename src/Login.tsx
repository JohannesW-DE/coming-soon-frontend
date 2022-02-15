import { Box, Text, Grommet, Button, Image, Anchor } from "grommet"
import React from 'react';
import { Github, Google, Twitter } from "grommet-icons";
import { Navigate } from "react-router-dom";
import { useAuth } from "./App";
import { theme } from "./theme";

function Login() {
  const auth = useAuth();
  
  if (auth?.checked && auth.user) {
    return <Navigate to="/coming-soon" replace />; 
  }

  if (!auth?.checked) {
    <Grommet theme={theme} full />
  }

  return (
      <Box align="center" gap="large">
      <Box width="large" background='background_dark_1' direction="column" align="center" margin={{'top': '200px'}} gap="medium" pad="medium" round="medium">
          <Text size="xxlarge">Coming Soon ™</Text>
        </Box>        
        <Box width="large" background='background_dark_1' direction="column" align="center" gap="medium" pad="medium" round="medium">
          <Text>Hi there! You need to login first to use this website.</Text>
          <Text size="xsmall"><i>... or find yourself a link to a public list!</i></Text>
        </Box>
        <Box width="large" background='background_dark_1' direction="column" align="center" gap="medium" pad="medium" round="medium">
          <Text size="small">Login supported via:</Text>
          <Box direction="row" gap="medium">
            {process.env.REACT_APP_LOGIN_GOOGLE && process.env.REACT_APP_LOGIN_GOOGLE === '1' &&
            <a href={`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/google/`}>
              <Button size='small' color="white" label="Google" icon={<Google />} />
            </a>
            }
            {process.env.REACT_APP_LOGIN_TWITTER && process.env.REACT_APP_LOGIN_TWITTER === '1' &&
            <a href={`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/twitter/`}>
              <Button size='small' color="white" label="Twitter" icon={<Twitter />} />
            </a>
            }
            {process.env.REACT_APP_LOGIN_GITHUB && process.env.REACT_APP_LOGIN_GITHUB === '1' &&
            <a href={`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/github/`}>
              <Button size='small' color="white" label="Github" icon={<Github />} />
            </a>              
            }
          </Box>
        </Box> 
        <Box width="large" background='background_dark_1' direction="column" align="center" pad="medium" round="medium" gap="small">
          <Text>All movie & tv show related data is gratefully provided by</Text>
          <Box width="medium" align="center" gap="small" direction="row">
            <Box width="200px" height="60px" align="center" gap="xsmall">
              <Anchor color="white" href="https://www.themoviedb.org/"><Text><b>The Movie Database</b></Text></Anchor>
              <Anchor color="white" href="https://www.themoviedb.org/">         
                <Box width="40px">
                  <Image src={`${process.env.REACT_APP_BACKEND_BASE_URL}/tmdb_full.svg`} />
                </Box>
              </Anchor>
            </Box>        
            <Box width="200px" height="60px" align="center" gap="xsmall">
              <Anchor color="white" href="https://www.justwatch.com/"><Text><b>JustWatch</b></Text></Anchor>
              <Anchor color="white" href="https://www.justwatch.com/">
                <Box height="20px">  
                  <Image src={`${process.env.REACT_APP_BACKEND_BASE_URL}/justwatch.svg`} />
                </Box>
              </Anchor>
            </Box>            
          </Box>
        </Box>               
      </Box>      

  )
}

export default Login;