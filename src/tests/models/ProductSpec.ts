import { Products } from '../../models/product';

const store = new Products();

describe('Product Model', () => {
  beforeAll(async () => {
    await store.create({
      name: 'product 1',
      price: 2000,
      category: 'hot',
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

  it('Create method should add a product', async () => {
    const result = await store.create({
      name: 'product 5',
      price: 788,
      category: 'warn',
    });
    expect(result.id).toBeGreaterThanOrEqual(2);
    expect(result.name).toEqual('product 5');
    expect(result.price).toEqual(788);
    expect(result.category).toEqual('warn');
  });

  it('a list of product', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('the correct product', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('snack');
    expect(result.price).toEqual(100);
    expect(result.category).toEqual('cold');
  });

  it('Delete method should remove the product', async () => {
    await store.delete(2);
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
