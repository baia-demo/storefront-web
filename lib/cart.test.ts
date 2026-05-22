import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { addToCart, cartTotal, removeFromCart } from "./cart";
import type { Product } from "./apis";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-test",
    name: "Produto Teste",
    description: "descrição",
    price: 49.9,
    stock: 100,
    category: "vestuario",
    ...overrides,
  };
}

describe("cartTotal", () => {
  test("soma price * quantity de cada linha", () => {
    const total = cartTotal([
      { productId: "a", name: "A", price: 10, quantity: 2 },
      { productId: "b", name: "B", price: 5, quantity: 3 },
    ]);
    expect(total).toBe(35);
  });

  test("retorna 0 para carrinho vazio", () => {
    expect(cartTotal([])).toBe(0);
  });

  test("lida com casas decimais sem perda relevante", () => {
    const total = cartTotal([
      { productId: "a", name: "A", price: 9.9, quantity: 3 },
    ]);
    expect(total).toBeCloseTo(29.7, 2);
  });
});

describe("removeFromCart", () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => { storage[key] = value; },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("remove apenas o item com o productId informado", () => {
    // Reproduz o bug: antes usava === em vez de !==, removendo os outros itens
    addToCart(makeProduct({ id: "r-001", name: "A", price: 10 }), 1);
    addToCart(makeProduct({ id: "r-002", name: "B", price: 20 }), 1);
    const result = removeFromCart("r-001");
    expect(result.some((l) => l.productId === "r-001")).toBe(false);
    expect(result.some((l) => l.productId === "r-002")).toBe(true);
  });
});

describe("addToCart", () => {
  test("adiciona produto novo em carrinho vazio", () => {
    // Em ambiente de teste (sem window), readCart() retorna [].
    const result = addToCart(makeProduct({ id: "p-001" }), 1);
    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe("p-001");
    expect(result[0].quantity).toBe(1);
  });

  test("respeita quantidade explícita ao adicionar produto novo", () => {
    const result = addToCart(makeProduct({ id: "p-002" }), 3);
    expect(result[0].quantity).toBe(3);
  });

  test("popula campos do produto no item do carrinho", () => {
    const product = makeProduct({
      id: "p-003",
      name: "Camiseta Azul",
      price: 79.9,
    });
    const result = addToCart(product, 1);
    expect(result[0].name).toBe("Camiseta Azul");
    expect(result[0].price).toBe(79.9);
  });
});
