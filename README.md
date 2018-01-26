[![Slack](http://alansouzati.github.io/artic/img/slack-badge.svg)](http://slackin.grommet.io)  [![Build Status](https://travis-ci.org/grommet/grommet-form.svg?branch=master)](https://travis-ci.org/grommet/react-formify) [![Test Coverage](https://codeclimate.com/github/grommet/grommet-form/badges/coverage.svg)](https://codeclimate.com/github/grommet/react-formify/coverage)  [![Dependency Status](https://david-dm.org/grommet/react-formify.svg)](https://david-dm.org/grommet/react-formify) [![devDependency Status](https://david-dm.org/grommet/react-formify/dev-status.svg)](https://david-dm.org/grommet/react-formify#info=devDependencies)

# react-formify

An uncontrolled react Form component with validation capabilities.

## Install

`npm install react-formify`

or 

`yarn add react-formify`

## Usage

```javascript
import React from 'react';
import Form from 'react-formify';

const emailExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const rules = {
  email: (value) => {
    if (!value || value === '') {
      return 'Email is required';
    } else if (!emailExpression.test(value)) {
      return 'Email is not valid';
    }
    return undefined;
  },
  name: 'Name is required',
};

const UserForm = () => (
  <Form
    defaultErrors={{ email: 'This is an existing email' }}
    defaultValue={{ email: 'alan@gmail.com' }}
    onSubmit={(user, reset) => {
      reset();
      alert(JSON.stringify(user, null, 2));
    }}
    rules={rules}
  >
    {(state, errors, isValid) => (
      <fieldset>
        <input {...state.name} />
        {errors.name ? <span className="error">{errors.name}</span> : undefined}
        <input {...state.email} />
        <input {...state.get('optional.field')} />
        {errors.email ? <span className="error">{errors.email}</span> : undefined}
        <button type='submit'>Add</button>
        <button
          type='button'
          onClick={() => {
            state.set('name', 'Alan Test');
            state.set({
              email: 'alan@test.com',
            });
          }}
          disabled={isValid}
        >
          Set Default
        </button>
      </fieldset>
    )}
  </Form>
);
```

* **NOTE**: :warning: it is the caller responsibility to add some control to submit the form. In this example we are adding a submit button.

## Try

[![](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/rlyxzpql9o)

## Form Props (API)

### **children**

Required. A function that will be invoked with state and errors. State is an object that you can
get the form properties per key defined in rules. For example, these rules:

```javascript
const rules = {
  email: (value) => {
    if (!value || value === '') {
      return 'Email is required';
    } else if (!emailExpression.test(value)) {
      return 'Email is not valid';
    }
    return undefined;
  },
  name: 'Name is required',
};
```

will generate the following state:

```
{
  email: {
    name: 'email',
    value: 'alan@gmail.com',
    onChange: (event) => { ... },
  },
  name: {
    name: 'name',
    value: '',
    onChange: (event) => { ... },
  }
}
```

This approach of holding the values in a raw object allows you to use any form element you want. You can use `<input />` from React, or `<TextInput />` from Grommet. All you need to do is to make sure to call `{...state.name}` where name is the property you want to assign to a given form element.

* **errors** object will hold the errors in a given form element. The errors will be present if you passed some `defaultErrors` or when the form is submitted.

You can call `state.get('optional')` to get the form properties object for fields that do not have any validation criteria. Similarly, you can call `errors.get('address.street.home')` to get the error of a given nested property in the object, returning undefined otherwise.

You can also call `state.set('key', value)` or `state.set({ key: value, key2: value })` to update `react-formify` resource value.

### **defaultErrors**

An object with default errors to show when the form is rendered.

### **defaultValue**

An object with default values to show when the form is rendered.

### **onSubmit**

Required. A function that will be invoked when the form is submitted and **valid**.
The object (resource) is passed as the first argument to the function. The second argument is a reset function that, upon called, will reset the form state.

### **onError**

Optional. A function that will be invoked when an error happens in the form.
This function will pass all the current errors in the callback.

### **onChange**

Optional. A function that will be invoked when any form element is changed.
This function will pass an object that contains what has been changed.

### **reset**

Optional. Whether or not the form should reset to its original state.

### **rules**

An object or function that will validate the form based on predefined rules. If `rules` is a function, it will be invoked when validation is needed. The function passes the resource as the argument so that the caller can decide which set of rules to return. This can be useful when you want a completely different set of rules depending on a given selection in the form, for example:

```javascript
const userRules = (user) => {
  const defaultValidation = {
    email: (value) => {
      if (!value || value === '') {
        return 'Email is required';
      } else if (!emailExpression.test(value)) {
        return 'Email is not valid';
      }
      return undefined;
    },
    name: 'Name is required',
    size: 'Size is required',
    confirm: 'Please confirm answers',
    address: {
      home: {
        street: 'Street is required',
      },
    },
  };
  if (
    user.address &&
    user.address.home &&
    user.address.home.street &&
    user.address.home.street !== ''
  ) {
    return deepMerge(defaultValidation, {
      address: {
        city: 'City is required if you provided street',
      },
    });
  }
  return defaultValidation;
};
```

In this example, `city` will be required if `street` name is provided.

## Build 

To build this library, execute the following commands:

  1. Install NPM modules

    $ npm install (or yarn install)

  2. Run pack

    $ npm run dist

  3. Test and run linters:

    $ npm run check
