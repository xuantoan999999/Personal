import { AngadonisPage } from './app.po';

describe('angadonis App', () => {
  let page: AngadonisPage;

  beforeEach(() => {
    page = new AngadonisPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
