import React from 'react';
import { render } from 'react-dom';
import {
  TextField,
  FormLabel,
  Paper,
  Fade,
  ExpansionPanelSummary,
  ExpansionPanel,
  ExpansionPanelDetails,
  Typography,
  Dialog
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import '../static/css/global.scss';
import './index.scss';
import GameView from './components/GameView/GameView';
import axios from 'axios';
import Button from './components/Button/Button';

class App extends React.Component {
  state = {
    form: {
      name: '',
      password: ''
    },
    user: null,
    expandedPanel: {},
    topPlayers: [],
    isLoading: false,
    isSignInMode: true,
    isAuthorized: false,
    isModalOpen: false,
    error: ''
  };

  componentDidMount = () => {
    this.fetchTopUsers();
  };

  toggleIsAuthorized = () => {
    this.setState({
      isAuthorized: !this.state.isAuthorized
    });
  };

  toggleLoading = () => {
    this.setState({
      isLoading: !this.state.isLoading
    });
  };

  toggleSignInMode = () => {
    this.setState({
      isSignInMode: !this.state.isSignInMode
    });
  };

  handleExpand = (panel) => {
    this.setState({
      expandedPanel: {
        ...this.state.expandedPanel,
        [panel]: !this.state.expandedPanel[panel]
      }
    });
  };

  toggleError = (error) => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      error: error
    })
  }

  fetchTopUsers = () => {
    this.setState(
      {
        topPlayers: []
      },
      () =>
        axios.patch('/game/top').then((res) => {
          this.setState({
            topPlayers: res.data || []
          });
        })
    );
  };

  updateUserScore = (user, total, ammo, level) => {
    console.log(total)

    axios
      .patch('/game/score', {
        scoreId: user.score,
        total: total,
        ammo: ammo,
        level: level
      })
      .then(this.fetchTopUsers)
  };

  fetchUserData = () => {
    this.toggleLoading();

    axios
      .post('/auth/sign-in', {
        name: this.state.form.name,
        password: this.state.form.password
      })
      .then((res) => {
        this.toggleLoading();
        this.toggleIsAuthorized();
        this.setState({
          user: {
            name: res.data.name,
            password: res.data.password,
            score: res.data.score
          }
        });
      })
      .catch(() => {
        this.toggleError('Wrong name or password')
        this.toggleLoading()
      });
  };

  createUser = () => {
    this.toggleLoading();

    axios
      .post('/auth/sign-up', {
        name: this.state.form.name,
        password: this.state.form.password
      })
      .then(() => {
        axios
          .post('/auth/sign-in', {
            name: this.state.form.name,
            password: this.state.form.password
          })
          .then((res) => {
            this.toggleLoading();
            this.toggleIsAuthorized();
            this.setState({
              user: {
                name: res.data.name,
                password: res.data.password,
                score: res.data.score
              }
            });
          })
          .catch(() => {
            this.toggleError('Wrong name or password')
          });
      })
      .catch(() => {
        this.toggleError('User with such name already exists')
        this.toggleLoading()
      });
  };

  handleNameChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        name: e.target.value
      }
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        password: e.target.value
      }
    });
  };

  signOut = (state) => {
    console.log(state);

    this.updateUserScore(this.state.user, state.score, 40 - state.actualAmmo, state.level);

    this.setState({
      isAuthorized: false,
      user: null
    });
  };

  render() {
    const { isLoading, isAuthorized, isSignInMode, expandedPanel, topPlayers } = this.state;

    if (isLoading) {
      return (
        <div className={'loader_wrapper'}>
          <div className={'lds-ellipsis'}>
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (isAuthorized) {
      return <GameView signOut={this.signOut} />;
    }

    return (
      <>
        <Dialog open={this.state.isModalOpen} onClose={() => this.toggleError()}>
          <div className={'dialog'}>
            {this.state.error}
          </div>
        </Dialog>
        <div className={'title'}>Shooting Range</div>
        <div className={'stats__wrapper'}>
          <Fade in={!!topPlayers.length}>
            <div>
              <div className={'stats__title'}>Top Players</div>
              {topPlayers.map((user) => (
                <ExpansionPanel
                  key={user.name}
                  expanded={expandedPanel[user.name]}
                  onChange={() => this.handleExpand(user.name)}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ content: 'stats__main' }}>
                    <Typography>{user.name}</Typography>
                    <Typography>{user.total || 0}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={'stats__details'}>
                    <Typography>Total score: {user.total || 0}</Typography>
                    <Typography>Ammunition spend: {user.targets_hit || 0}</Typography>
                    <Typography>Levels passed: {user.level || 0}</Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))}
            </div>
          </Fade>
        </div>
        <div className={'form__wrapper'}>
          <Paper>
            <form className={'form'} onSubmit={isSignInMode ? this.fetchUserData : this.createUser}>
              <FormLabel>
                <TextField required color={'secondary'} label="Name" onChange={this.handleNameChange} />
              </FormLabel>
              <FormLabel>
                <TextField
                  required
                  color={'secondary'}
                  id="filled-required"
                  label="Password"
                  type={'password'}
                  onChange={this.handlePasswordChange}
                />
              </FormLabel>
              <a onClick={this.toggleSignInMode}>{isSignInMode ? 'Sign up instead?' : 'Sign in instead?'}</a>
              <Button variant="outlined" onClick={isSignInMode ? this.fetchUserData : this.createUser}>
                {isSignInMode ? 'Sign in' : 'Sign up'}
              </Button>
            </form>
          </Paper>
        </div>
      </>
    );
  }
}

render(<App />, document.getElementById('root'));
