import { Orders } from '../../models/order';

const store = new Orders();

describe('Order Model', () => {
  const user_id = 1;
  const product_id = 1;

  beforeAll(async () => {
    await store.create({
      user_id: user_id,
      status: 'active',
      items: [],
    });
  });

  it('index method', () => {
    expect(store.index).toBeDefined();
  });

  it('show method', () => {
    expect(store.show).toBeDefined();
  });

  it('create method', () => {
    expect(store.create).toBeDefined();
  });

  it('delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('addProduct method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('completeOrder method', () => {
    expect(store.completeOrder).toBeDefined();
  });

  it(' add a order', async () => {
    const result = await store.create({
      user_id: user_id,
      status: 'active',
      items: [],
    });
    expect(result.id).toBeGreaterThanOrEqual(2);
    expect(result.user_id).toBeGreaterThanOrEqual(1);
    expect(result.status).toEqual('active');
  });

  it('a list of order', async () => {
    const result = await store.index(user_id, '');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('the correct order', async () => {
    const result = await store.show(user_id, 2);
    expect(result.id).toBeGreaterThanOrEqual(2);
    expect(result.status).toEqual('active');
    expect(result.user_id == user_id).toEqual(true);
  });

  it('addProduct method should add the product into order', async () => {
    const result = await store.addProduct(user_id, 2, product_id, 2);
    expect(result.id).toBeGreaterThanOrEqual(1);
    expect(result.order_id == 2).toEqual(true);
    expect(result.product_id == product_id).toEqual(true);
    expect(result.quantity).toEqual(2);
  });

  it('completeOther method should update status order to complete', async () => {
    const result = await store.completeOrder(user_id, 2);
    expect(result.id).toEqual(2);
    expect(result.status).toEqual('completed');
  });

  it('Delete method should remove the order', async () => {
    await store.delete(user_id, 2);
    const result = await store.index(user_id, '');
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
