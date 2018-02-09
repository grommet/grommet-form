'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _FormState = require('./FormState');

var _FormState2 = _interopRequireDefault(_FormState);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form(props, context) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props, context));

    _initialiseProps.call(_this);

    var formState = new _FormState2.default(props.rules, props.defaultValue, _this.onChange);

    _this.state = {
      formState: formState,
      resource: formState.get(),
      errors: props.defaultErrors,
      rules: props.rules,
      isFormSubmitted: false
    };
    return _this;
  }

  _createClass(Form, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.reset || !(0, _utils.deepCompare)(nextProps.rules, this.props.rules) || !(0, _utils.deepCompare)(nextProps.defaultErrors, this.props.defaultErrors) || !(0, _utils.deepCompare)(nextProps.defaultValue, this.props.defaultValue)) {
        this.reset(nextProps);
      }
    }
  }, {
    key: 'reset',
    value: function reset(props) {
      var formState = new _FormState2.default(props.rules, props.defaultValue, this.onChange);

      this.setState({
        formState: formState,
        resource: formState.get(),
        errors: props.defaultErrors,
        rules: props.rules
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var children = this.props.children;
      var _state = this.state,
          _state$errors = _state.errors,
          errors = _state$errors === undefined ? {} : _state$errors,
          formState = _state.formState,
          resource = _state.resource,
          rules = _state.rules;

      var state = this.getObjectStateValue(typeof rules === 'function' ? rules(resource) : rules);
      state.get = function (key) {
        return _this2.getStateValue(key);
      };
      state.set = function (key, value) {
        return _this2.setStateValue(key, value);
      };
      errors.get = function (key) {
        return (0, _utils.getValueByKey)(errors, key);
      };
      return _react2.default.createElement(
        'form',
        { onSubmit: this.onSubmit },
        children(state, errors, formState.isValid())
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.defaultProps = {
  defaultErrors: undefined,
  defaultValue: undefined,
  onError: undefined,
  onChange: undefined,
  reset: undefined
};
Form.propTypes = {
  children: _propTypes2.default.func.isRequired,
  defaultErrors: _propTypes2.default.object,
  defaultValue: _propTypes2.default.object,
  onSubmit: _propTypes2.default.func.isRequired,
  onError: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  reset: _propTypes2.default.bool,
  rules: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.func]).isRequired
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onChange = function (updated) {
    var _state2 = _this3.state,
        isFormSubmitted = _state2.isFormSubmitted,
        formState = _state2.formState;

    if (isFormSubmitted) {
      _this3.setState({ resource: formState.get(), errors: formState.getErrors() });
    } else {
      _this3.setState({ resource: formState.get(), errors: undefined });
    }
    if (_this3.props.onChange) {
      _this3.props.onChange(updated);
    }
  };

  this.onSubmit = function (event) {
    var _props = _this3.props,
        onSubmit = _props.onSubmit,
        onError = _props.onError;
    var formState = _this3.state.formState;

    event.preventDefault();
    if (formState.isValid()) {
      onSubmit(formState.getResource(), function () {
        return _this3.reset(_this3.props);
      });
    } else {
      var errors = formState.getErrors();
      if (typeof onError === 'function') {
        onError(errors);
      }
      _this3.setState({ isFormSubmitted: true, errors: errors });
    }
  };

  this.getStateValue = function (key) {
    var _state3 = _this3.state,
        formState = _state3.formState,
        resource = _state3.resource;

    return {
      name: key,
      value: (0, _utils.getValueByKey)(resource, key) || '',
      checked: (0, _utils.getValueByKey)(resource, key) === true,
      onChange: function onChange(event) {
        var value = typeof event === 'string' ? event : event.option;
        if (!value && event.target) {
          value = event.target.value;
          if (event.target && event.target.type === 'checkbox' && (event.target.value === '' || event.target.value === 'true')) {
            value = event.target.checked;
          }
        }
        formState.set(key, typeof value === 'undefined' ? '' : value);
      }
    };
  };

  this.setStateValue = function (key, value) {
    var formState = _this3.state.formState;

    formState.set(key, value);
  };

  this.getObjectStateValue = function (obj, parentKey) {
    var objStateValue = {};
    Object.keys(obj).forEach(function (key) {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'function') {
        objStateValue[key] = _this3.getStateValue(parentKey ? parentKey + '.' + key : key);
      } else if ((0, _utils.isObject)(obj[key])) {
        objStateValue[key] = _this3.getObjectStateValue(obj[key], parentKey ? parentKey + '.' + key : key);
      }
    });
    return objStateValue;
  };
};

exports.default = Form;