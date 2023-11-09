import { Admins } from '../../models/admin';

const store = new Admins();

describe('Admin Model', () => {
  it('index method', () => {
    expect(store.index).toBeDefined();
  });

  it('show method', () => {
    expect(store.show).toBeDefined();
  });

  it('create method', () => {
    expect(store.create).toBeDefined();
  });

  it('authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('add a user', async () => {
    const result = await store.create({
      username: 'admin255',
      password: '123456',
    });
    expect(result.id).toBeGreaterThan(1);
    expect(result.username).toEqual('admin255');
  });

  it('a list of admin', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('Show method should return the correct user', async () => {
    const result = await store.show('1');
    expect(result.id).toEqual(1);
    expect(result.username).toEqual('admin');
  });

  it('Authenticate method for admin', async () => {
    const result = await store.authenticate('admin', '123456');
    expect(result?.id).toEqual(1);
    expect(result?.username).toEqual('admin');
  });
});
