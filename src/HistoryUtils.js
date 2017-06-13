import history from './history';

export const jumpTo = to => history.push(to);
export const goBack = () => history.goBack();
export const goForward = () => history.goForward();

export default { jumpTo, goBack, goForward };