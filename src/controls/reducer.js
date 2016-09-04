export const STATE_PAUSED = 'paused';
export const STATE_PLAYING = 'playing';


const initialState = STATE_PAUSED;


const play = () => STATE_PLAYING;
const pause = () => STATE_PAUSED;


export const CONTROLS_PLAY = 'CONTROLS_PLAY';
export const CONTROLS_PAUSE = 'CONTROLS_PAUSE';
export const controls = (state = initialState, {type, ...action}) => {
  switch (type) {
    case CONTROLS_PLAY:
      return play(state, action);
    case CONTROLS_PAUSE:
      return pause(state, action);
    default:
      return state;
  }
};

