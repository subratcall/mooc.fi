import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent, TextField } from "@material-ui/core";
import styled from "styled-components";
import { signIn } from "../lib/authentication";
import NextI18Next from '../i18n';


const Row = styled.div`
  margin-bottom: 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  height: 3em;
  & > * {
    margin-right: 1rem;
  }
`;

function SignIn(t: Function) {
  console.log(t)
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Card>
      <CardContent>
        <TitleContainer>
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h2" gutterBottom={true}>
          <NextI18Next.Trans i18nKey='login'/>
          </Typography>
        </TitleContainer>
        <form>
          <Row>
            <TextField
              required
              id="outlined-adornment-password"
              variant="outlined"
              label="Sähköpostiosoite tai käyttäjänimi"
              fullWidth
              value={email}
              onChange={o => {
                setEmail(o.target.value);
                setError(false);
              }}
            />
          </Row>
          <Row>
            <TextField
              required
              id="outlined-adornment-password"
              variant="outlined"
              type="password"
              label="Salasana"
              fullWidth
              value={password}
              onChange={o => {
                setPassword(o.target.value);
                setError(false);
              }}
            />
          </Row>
          {error && <Row> <NextI18Next.Trans i18nKey='error'/> {errorMessage}</Row>}
          <Button
            onClick={async e => {
              e.preventDefault();
              try {
                await signIn({ email, password });
              } catch (e) {
                setError(true);
                setErrorMessage(e.message);
              }
            }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            <NextI18Next.Trans i18nKey='login'/>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default NextI18Next.withNamespaces('common')(SignIn);
