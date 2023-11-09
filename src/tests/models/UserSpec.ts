import { Users } from '../../models/user';

const store = new Users();

describe('User Model', () => {
  beforeAll(async () => {
    await store.create({
      username: 'thangplc123',
      password: '123456',
      first_name: 'Thang',
      last_name: 'Phan',
    });
  });

  it(' index method', () => {
    expect(store.index).toBeDefined();
  });

  it(' show method', () => {
    expect(store.show).toBeDefined();
  });

  it(' create method', () => {
    expect(store.create).toBeDefined();
  });

  it(' delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('add a user', async () => {
    const result = await store.create({
      username: 'thangplc5676',
      password: '123456',
      first_name: 'Thang',
      last_name: 'Phan',
    });
    expect(result.id).toBeGreaterThanOrEqual(3);
    expect(result.username).toEqual('thangplc5676');
    expect(result.first_name).toEqual('Thang');
    expect(result.last_name).toEqual('Phan');
  });

  it('a list of user', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('the correct user', async () => {
    const result = await store.show(1);
    expect(result.id).toBeGreaterThanOrEqual(1);
    expect(result.username).toEqual('thangplc');
    expect(result.first_name).toEqual('Thang');
    expect(result.last_name).toEqual('Phan');
  });

  it('remove the user', async () => {
    await store.delete(2);
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
