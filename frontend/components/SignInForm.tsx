import React, { useState } from "react";
import {
        FormControl,
        InputLabel,
        Input, 
        Button }from "@material-ui/core";

import { signIn } from "../lib/authentication";
import NextI18Next from '../i18n';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      widht: '100%',
      marginTop: '1em'

    },
    submit: {
     marginTop: '1em'
    },
   }),
);



function SignIn(t: Function) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const classes = useStyles()

  return (
    <form className={classes.form}>
      <FormControl required fullWidth>
        <InputLabel htmlFor="email">
          <NextI18Next.Trans i18nKey='username'/>
        </InputLabel>
        <Input 
          id="email" 
          name="email" 
          autoComplete="email" 
          autoFocus 
          onChange={o => {
            setEmail(o.target.value);
            setError(false);
          }}/>
      </FormControl>
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="password">
          <NextI18Next.Trans i18nKey='password'/>
        </InputLabel>
        <Input 
          name="password" 
          type="password" 
          id="password" 
          autoComplete="current-password"
          onChange={o => {
            setPassword(o.target.value);
            setError(false);
          }}
           />
      </FormControl>
      <Button
        className={classes.submit}
        type='submit'
        fullWidth
        variant='contained'
        color='secondary'
        onClick={async e => {
          e.preventDefault();
          try {
            await signIn({ email, password });
          } catch (e) {
            setError(true);
            setErrorMessage(e.message);
          }
        }}
        >
        <NextI18Next.Trans i18nKey='login'/>
      </Button>
    </form>
     
  );
}

export default NextI18Next.withNamespaces('common')(SignIn);

/*
 
          
          {error && <Alert role='alert'> <NextI18Next.Trans i18nKey='error'/> {errorMessage}</Alert>}
          */