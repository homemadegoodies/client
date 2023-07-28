import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  Card,
  Alert,
} from "@mui/material";
import useStyles from "../hooks/useStyles";
import SendIcon from "@mui/icons-material/Send";
import emailjs from "@emailjs/browser";

export default function ContactView() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const classes = useStyles();
  const form = useRef();

  const validate = () => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      return false;
    }
    if (firstName.length < 2) {
      return false;
    }
    if (subject.length < 2) {
      return false;
    }
    if (message.length < 2) {
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    // console.log({ email, firstName, subject, message });

    emailjs
      .sendForm(
        "service_5ujmx8v",
        "template_nrynkjp",
        form.current,
        "_ERbwv_HXm2Zj0LFt"
      )
      .then((result) => {
        // console.log(result.text);
        setIsSent(true);
        setEmail("");
        setFirstName("");
        setSubject("");
        setMessage("");
      })
      .catch((error) => {
        console.log(error.text);
      });
  };

  return (
    <Box>
      <Typography variant="h4" className={classes.formHeading}>
        Contact us
      </Typography>
      <br />

      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        If you have any questions or concerns, please use the form below to send
        us a message.
      </Typography>

      <Box className={classes.formContainer}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
            m: 2,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            "&:hover": {
              transform: "scale(1.01)",
              transition: "transform 0.3s ease-in-out",
            },
          }}
        >
          {isSent && (
            <Alert
              severity="success"
              onClose={() => {
                setIsSent(false);
              }}
            >
              Message sent successfully!
            </Alert>
          )}
          <Box
            className={classes.form}
            component="form"
            noValidate
            autoComplete="off"
            ref={form}
          >
            <TextField
              name="user_name"
              label="Full Name"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <TextField
              name="user_email"
              label="Email"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              name="subject"
              label="Subject"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <TextareaAutosize
              name="message"
              aria-label="minimum height"
              minRows={6}
              placeholder="Enter a message"
              className={classes.textArea}
              spellCheck
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              type="submit"
              color="primary"
              onClick={submitForm}
              fullWidth
              disabled={
                !email || !firstName || !subject || !message || !validate()
              }
            >
              Send
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
