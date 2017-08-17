const Routes = require('./../lib/Routes');

Routes.get('/', 'Web/index.get');
Routes.group('', () => {})