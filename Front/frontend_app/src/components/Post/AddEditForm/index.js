import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';

import {
  Box, Button, Grid, MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import CircleLoader from '../../header/CircleLoader';

const AddEditForm = function ({
  postData, mutate, isLoading, formName, id,
}) {
  const schema = Yup.object().shape({
    User_ID: Yup.number().typeError('User must be a number').required(),
    Title: Yup.string('Title must not be empty').max(125, 'Too Long!').required(),
    Text: Yup.string('Text must not be empty').required(),
    Visibility: Yup.string().required(),
  });

  const visibilityVars = [
    {
      value: 'none',
      label: 'None',
    },
    {
      value: 'friends',
      label: 'Friends',
    },
    {
      value: 'all',
      label: 'All',
    },
  ];

  const [image, setImage] = useState();
  const [filename, setFilename] = useState();

  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file.type.match('image.*') && file.size < 10000000) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFilename(file.name);
    } else {
      console.error('Image error');
    }
  };

  const onFormSubmit = (data, actions) => {
    actions.setSubmitting(true);
    if (id === null) {
      mutate(data);
    } else {
      mutate({ id, data });
    }
    actions.setSubmitting(false);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid>
        {isLoading && <CircleLoader />}

        <Box margin={1}><h1>{formName}</h1></Box>

        <Formik
          onSubmit={onFormSubmit}
          initialValues={postData}
          validationSchema={schema}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              <Box margin={1}>
                <Grid container columnSpacing={{ xs: 1 }}>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      type="integer"
                      name="User_ID"
                      label="User_ID"
                      helperText="Please Enter User_ID"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      fullWidth
                      type="text"
                      name="Visibility"
                      label="Visibility"
                      helperText="Please Enter Visibility"
                      select
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {visibilityVars.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  fullWidth
                  type="text"
                  name="Title"
                  label="Title"
                  helperText="Please Enter Post Title"
                />
              </Box>
              <Box
                margin={1}
                sx={{
                  width: 500,
                  maxWidth: '100%',
                }}
              >
                <Field
                  component={TextField}
                  fullWidth
                  multiline
                  maxRows={8}
                  type="text"
                  name="Text"
                  label="Text"
                  helperText="Please Enter Post Text"
                />
              </Box>
              {image && (
              <Box margin={1}>
                <img width="200vh" src={image} alt="ddd" />
              </Box>
              )}
              <Box margin={1}>
                <Button variant="outlined" component="label">
                  Choose image
                  <input type="file" hidden onChange={handleChange} />
                </Button>
              </Box>
              {filename}
              <Grid container columnSpacing={{ xs: 1 }}>
                <Grid item xs={8}>
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item xs={3.6}>
                  <Button
                    href="/posts"
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default AddEditForm;

AddEditForm.propTypes = {
  postData: PropTypes.shape({
    Post_ID: PropTypes.number,
    User_ID: PropTypes.number,
    Title: PropTypes.string,
    Text: PropTypes.string,
    Timestamp: PropTypes.string,
    Visibility: PropTypes.string,
  }).isRequired,
  formName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  mutate: PropTypes.func.isRequired,
  id: PropTypes.number,
};

AddEditForm.defaultProps = {
  id: null,
};
