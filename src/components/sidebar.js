import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';

import Button from 'material-ui-next/Button';
import Divider from 'material-ui-next/Divider';
import Drawer from 'material-ui-next/Drawer';
import Grid from 'material-ui-next/Grid';
import IconButton from 'material-ui-next/IconButton';
import Typography from 'material-ui-next/Typography';
import CloudDownload from 'material-ui-icons-next/CloudDownload';
import CloudUpload from 'material-ui-icons-next/CloudUpload';
import DirectionsRun from 'material-ui-icons-next/DirectionsRun';
import { withStyles } from 'material-ui-next/styles';

import Alert from './alert';
import InputField from './inputField';

import { DEFAULT_WORKOUT } from '../constants';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    const {
      intervalTime,
      restTime,
      setRestTime,
      targetIntervals,
      targetSets,
      warmupTime
    } = props.settings;

    this.state = {
      intervalTime,
      restTime,
      setRestTime,
      showAlert: '',
      targetIntervals,
      targetSets,
      warmupTime
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps.settings });
  }

  resetSettings = () => {
    this.setState({
      ...DEFAULT_WORKOUT
    });
  };

  showAlert = (msg = '') => {
    this.setState({ showAlert: msg });
    setTimeout(() => {
      this.setState({ showAlert: '' });
    }, 3000);
  };

  loadWorkout = () => {
    this.props
      .loadWorkout()
      .then(saveData => {
        this.showAlert('Workout loaded. Confirm?');
        this.setState({
          ...saveData
        });
      })
      .catch(error => {
        this.showAlert('Problem loading workout.');
        // console.log('Error loading saved workout...', error);
      });
  };

  saveWorkout = () => {
    this.props
      .saveWorkout()
      .then(resp => this.showAlert('Workout saved as default.'))
      .catch(err => {
        this.showAlert('Problem saving workout.');
        // console.log('There was a problem saving the workout :(');
      });
  };

  validInput = value => {
    // return isNumber and inRange
    return Number.isInteger(value) && /^\d{1,3}$/.test(value);
  };

  updateField = fieldName => event => {
    // restrict to three digits
    this.setState({
      [fieldName]:
        event.target.value.length < 4
          ? event.target.value
          : this.state[fieldName]
    });
  };

  updateSettings = () => {
    const newSettings = Object.keys(this.state).reduce((settings, key) => {
      settings[key] = parseInt(this.state[key] || 0, 10);
      return settings;
    }, {});

    this.props.updateSettings(newSettings);

    this.setState(newSettings);
  };

  render() {
    const { classes, open, handleDrawerClose } = this.props;
    const {
      intervalTime,
      restTime,
      setRestTime,
      showAlert,
      targetIntervals,
      targetSets,
      warmupTime
    } = this.state;

    return (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawer
        }}
        anchor="right"
        open={open}
      >
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <div className={classes.drawer__header}>
              <Typography type="title" color="inherit">
                Configuration
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <DirectionsRun />
              </IconButton>
            </div>
          </Grid>

          <Grid item xs={6}>
            <InputField
              name={'targetSets'}
              label={'Tabatas'}
              units={'sets'}
              value={String(targetSets)}
              updateField={this.updateField('targetSets')}
            />
          </Grid>
          <Grid item xs={6}>
            <InputField
              name={'targetIntervals'}
              label={'Intervals'}
              units={'/set'}
              value={String(targetIntervals)}
              updateField={this.updateField('targetIntervals')}
            />
          </Grid>

          <Grid item xs={6}>
            <InputField
              name={'intervalTime'}
              label={'Interval length'}
              units={'Sec'}
              value={String(intervalTime)}
              updateField={this.updateField('intervalTime')}
            />
          </Grid>
          <Grid item xs={6}>
            <InputField
              name={'restTime'}
              label={'Interval rest'}
              units={'Sec'}
              value={String(restTime)}
              updateField={this.updateField('restTime')}
            />
          </Grid>

          <Grid item xs={6}>
            <InputField
              name={'setRestTime'}
              label={'Set rest'}
              units={'Sec'}
              value={String(setRestTime)}
              updateField={this.updateField('setRestTime')}
            />
          </Grid>
          <Grid item xs={6}>
            <InputField
              name={'warmupTime'}
              label={'Warmup'}
              units={'Sec'}
              value={String(warmupTime)}
              updateField={this.updateField('warmupTime')}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider className={classes.sidebar__divider} />
            <Button
              className={classes.button}
              raised
              color="default"
              onClick={this.resetSettings}
            >
              RESET
            </Button>
            <Button
              className={classes.button}
              raised
              color="primary"
              onClick={this.updateSettings}
            >
              CONFIRM
            </Button>
            <Typography type="body2" gutterBottom>
              Timer will reset on CONFIRM
            </Typography>

            <Button
              className={classes.button}
              style={{ flexDirection: 'column' }}
              raised
              color="primary"
              variant="fab"
              onClick={this.saveWorkout}
            >
              save <CloudUpload style={{ marginLeft: '.5rem' }} />
            </Button>

            <Button
              className={classes.button}
              style={{ flexDirection: 'column' }}
              raised
              color="primary"
              variant="fab"
              onClick={this.loadWorkout}
            >
              load <CloudDownload style={{ marginLeft: '.5rem' }} />
            </Button>

            <Alert text={showAlert} />
          </Grid>
        </Grid>
      </Drawer>
    );
  }
}
/*
            <IconButton
              color="primary"
              className={classnames(classes.button_icon, classes.button)}
              onClick={this.saveWorkout}
            >
              <CloudUpload />
            </IconButton>
            <IconButton
              className={classnames(classes.button_icon, classes.button)}
              color="primary"
              onClick={this.loadWorkout}
            >
              <CloudDownload />
            </IconButton>
*/

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  settings: PropTypes.shape({
    intervalTime: PropTypes.number,
    restTime: PropTypes.number,
    setRestTime: PropTypes.number,
    targetIntervals: PropTypes.number,
    targetSets: PropTypes.number,
    warmupTime: PropTypes.number
  }),
  handleDrawerClose: PropTypes.func.isRequired,
  loadWorkout: PropTypes.func.isRequired,
  saveWorkout: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired
};

const styles = theme => ({
  drawer: {
    width: 340,
    padding: 30,
    paddingTop: 20
  },
  drawer__header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  button: {
    margin: theme.spacing.unit,
    width: '42%',
    fontSize: '1.2rem'
  },
  // button_icon: {
  //   fontSize: '3rem'
  // },
  sidebar__divider: {
    margin: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Sidebar);
